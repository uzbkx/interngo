"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Play,
  Plus,
  CheckCircle,
  XCircle,
  Globe,
  Sparkles,
  Search,
  ExternalLink,
  Radar,
  Clock,
  History,
} from "lucide-react";

interface Source {
  id: string;
  name: string;
  url: string;
  description: string | null;
  isActive: boolean;
  lastScraped: string | null;
  _count: { results: number };
}

interface ScoutedResult {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  isApproved: boolean;
  isRejected: boolean;
  createdAt: string;
  source: { name: string };
}

interface ScoutRunResult {
  sourceId: string;
  sourceName: string;
  found: number;
  added: number;
  autoApproved: number;
  skippedDuplicates: number;
  errors: string[];
}

interface DiscoveredSource {
  name: string;
  url: string;
  description: string;
}

interface ScouterRunLog {
  id: string;
  type: string;
  status: string;
  sourcesCount: number;
  foundCount: number;
  addedCount: number;
  autoApproved: number;
  errors: string[];
  startedAt: string;
  completedAt: string | null;
}

export default function ScouterAdminPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [results, setResults] = useState<ScoutedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningSource, setRunningSource] = useState<string | null>(null);
  const [runResults, setRunResults] = useState<ScoutRunResult[]>([]);
  const [showAddSource, setShowAddSource] = useState(false);

  // Discovery state
  const [discoverTopic, setDiscoverTopic] = useState("");
  const [discovering, setDiscovering] = useState(false);
  const [discovered, setDiscovered] = useState<DiscoveredSource[]>([]);
  const [addingSource, setAddingSource] = useState<string | null>(null);

  // Run history
  const [runHistory, setRunHistory] = useState<ScouterRunLog[]>([]);

  async function fetchData() {
    setLoading(true);
    try {
      const [sourcesRes, resultsRes, runsRes] = await Promise.all([
        apiFetch("/scouter/sources"),
        apiFetch("/scouter/results?pending=true"),
        apiFetch("/scouter/runs"),
      ]);
      const sourcesData = await sourcesRes.json();
      const resultsData = await resultsRes.json();
      const runsData = await runsRes.json();
      setSources(sourcesData.sources || []);
      setResults(resultsData.results || []);
      setRunHistory(runsData.runs || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function addSource(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await apiFetch("/scouter/sources", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        url: form.get("url"),
        description: form.get("description"),
      }),
    });
    setShowAddSource(false);
    fetchData();
  }

  async function addDiscoveredSource(source: DiscoveredSource) {
    setAddingSource(source.url);
    await apiFetch("/scouter/sources", {
      method: "POST",
      body: JSON.stringify(source),
    });
    setDiscovered((prev) => prev.filter((s) => s.url !== source.url));
    setAddingSource(null);
    fetchData();
  }

  async function runScout(sourceId?: string) {
    setRunningSource(sourceId || "all");
    setRunResults([]);
    try {
      const res = await apiFetch("/scouter/run", {
        method: "POST",
        body: JSON.stringify(sourceId ? { sourceId } : {}),
      });
      const data = await res.json();
      if (data.error) {
        setRunResults([
          {
            sourceId: "",
            sourceName: "Error",
            found: 0,
            added: 0,
            autoApproved: 0,
            skippedDuplicates: 0,
            errors: [data.error],
          },
        ]);
      } else {
        setRunResults(data.results || []);
      }
      fetchData();
    } finally {
      setRunningSource(null);
    }
  }

  async function handleResult(id: string, action: "approve" | "reject") {
    await apiFetch(`/scouter/results/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ approve: action === "approve" }),
    });
    setResults((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleDiscover() {
    if (!discoverTopic) return;
    setDiscovering(true);
    setDiscovered([]);
    try {
      const res = await apiFetch("/scouter/discover", {
        method: "POST",
        body: JSON.stringify({ topic: discoverTopic }),
      });
      const data = await res.json();
      setDiscovered(data.suggestions || []);
    } finally {
      setDiscovering(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Radar className="h-8 w-8" />
            AI Scouter
          </h1>
          <p className="text-muted-foreground">
            Automatically discover and import opportunities from around the web
          </p>
        </div>
        <Button
          onClick={() => runScout()}
          disabled={runningSource !== null || sources.length === 0}
        >
          {runningSource === "all" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Scout All Sources
        </Button>
      </div>

      {/* Run results banner */}
      {runResults.length > 0 && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Scouting Results</h3>
            {runResults.map((r, i) => (
              <div key={i} className="text-sm mb-1">
                <span className="font-medium">{r.sourceName}:</span> Found{" "}
                {r.found} opportunities, added {r.added} new
                {r.errors.length > 0 && (
                  <span className="text-destructive">
                    {" "}
                    ({r.errors.length} error
                    {r.errors.length > 1 ? "s" : ""})
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="sources">
        <TabsList>
          <TabsTrigger value="sources">
            <Globe className="h-4 w-4 mr-1.5" />
            Sources ({sources.length})
          </TabsTrigger>
          <TabsTrigger value="review">
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Review ({results.length})
          </TabsTrigger>
          <TabsTrigger value="discover">
            <Sparkles className="h-4 w-4 mr-1.5" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-1.5" />
            History ({runHistory.length})
          </TabsTrigger>
        </TabsList>

        {/* Sources Tab */}
        <TabsContent value="sources" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddSource(!showAddSource)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Source
            </Button>
          </div>

          {showAddSource && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <form onSubmit={addSource} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Erasmus+"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        name="url"
                        type="url"
                        placeholder="https://..."
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="What kind of opportunities does this source list?"
                    />
                  </div>
                  <Button type="submit" size="sm">
                    Add Source
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {sources.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No sources yet. Add one or use Discover to find sources.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((source) => (
                <Card key={source.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{source.name}</h3>
                          <Badge
                            variant={source.isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {source.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {source.url.slice(0, 60)}
                          {source.url.length > 60 ? "..." : ""}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        {source.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {source.description}
                          </p>
                        )}
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{source._count.results} results found</span>
                          {source.lastScraped && (
                            <span>
                              Last scraped:{" "}
                              {new Date(
                                source.lastScraped
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runScout(source.id)}
                        disabled={runningSource !== null}
                      >
                        {runningSource === source.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="mt-4">
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No pending results to review</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result) => (
                <Card key={result.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{result.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            via {result.source.name}
                          </Badge>
                        </div>
                        {result.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {result.description}
                          </p>
                        )}
                        {result.url && (
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline mt-1 inline-flex items-center gap-1"
                          >
                            View source <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleResult(result.id, "approve")}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleResult(result.id, "reject")}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover" className="mt-4">
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">
                Discover New Sources with AI
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tell the AI what kind of opportunities to search for, and it
                will suggest websites to monitor.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. scholarships for Central Asian students, tech internships, UN programs..."
                  value={discoverTopic}
                  onChange={(e) => setDiscoverTopic(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleDiscover()
                  }
                />
                <Button
                  onClick={handleDiscover}
                  disabled={discovering || !discoverTopic}
                >
                  {discovering ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Discover
                </Button>
              </div>
            </CardContent>
          </Card>

          {discovered.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">
                Found {discovered.length} new sources
              </h3>
              {discovered.map((source) => (
                <Card key={source.url}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{source.name}</h4>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {source.url.slice(0, 60)}...
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">
                          {source.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addDiscoveredSource(source)}
                        disabled={addingSource === source.url}
                      >
                        {addingSource === source.url ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-1" />
                        )}
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          {runHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No scouter runs yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {runHistory.map((run) => (
                <Card key={run.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              run.status === "completed"
                                ? "default"
                                : run.status === "running"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {run.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {run.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(run.startedAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm mt-2">
                          {run.sourcesCount > 0 && (
                            <span>
                              <strong>{run.sourcesCount}</strong> sources
                            </span>
                          )}
                          {run.foundCount > 0 && (
                            <span>
                              <strong>{run.foundCount}</strong> found
                            </span>
                          )}
                          <span>
                            <strong>{run.addedCount}</strong> added
                          </span>
                          {run.autoApproved > 0 && (
                            <span className="text-green-600">
                              <strong>{run.autoApproved}</strong> auto-published
                            </span>
                          )}
                        </div>
                        {run.errors.length > 0 && (
                          <p className="text-xs text-destructive mt-1">
                            {run.errors.length} error(s):{" "}
                            {run.errors.slice(0, 2).join("; ")}
                            {run.errors.length > 2 && "..."}
                          </p>
                        )}
                      </div>
                      {run.completedAt && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {Math.round(
                            (new Date(run.completedAt).getTime() -
                              new Date(run.startedAt).getTime()) /
                              1000
                          )}
                          s
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
