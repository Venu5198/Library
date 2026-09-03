import React, { useState, useCallback } from "react";
import { Button, Card, Container, Typography, Input, Badge } from "@myorg/ui";
import { useApi } from "../hooks/useApi";
import { getExamples, createExample, deleteExample } from "../services/api";
import type { Example } from "../services/api";
import "./ExamplesPage.css";

export const ExamplesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const fetcher = useCallback(
    () => getExamples({ search: searchQuery || undefined }),
    [searchQuery],
  );

  const { data, loading, error, refetch } = useApi(fetcher, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError("Title is required.");
      return;
    }
    setFormError("");
    setCreating(true);
    try {
      await createExample({
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
      });
      setNewTitle("");
      setNewDesc("");
      refetch();
    } catch (err) {
      setFormError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to create example.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExample(id);
      refetch();
    } catch {
      // silently refetch — example may already be gone
      refetch();
    }
  };

  return (
    <div className="examples-page fade-in">
      <Container maxWidth="xl">
        <div className="examples-page__header">
          <Typography variant="h1">Examples</Typography>
          <Typography variant="body1" color="muted">
            Live data from the backend REST API. Demonstrates full-stack
            connectivity.
          </Typography>
        </div>

        <div className="examples-page__layout">
          {/* Create form */}
          <aside className="examples-page__sidebar">
            <Card
              variant="default"
              padding="md"
              header={<Typography variant="h5">Create Example</Typography>}
            >
              <form onSubmit={handleCreate} noValidate>
                <div className="create-form">
                  <Input
                    label="Title"
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (e.target.value) setFormError("");
                    }}
                    placeholder="Example title"
                    error={formError}
                    fullWidth
                    required
                  />
                  <Input
                    label="Description"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Optional description"
                    fullWidth
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={creating}
                  >
                    Create
                  </Button>
                </div>
              </form>
            </Card>
          </aside>

          {/* List */}
          <div className="examples-page__main">
            {/* Search */}
            <form onSubmit={handleSearch} className="examples-search">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search examples..."
                fullWidth
                aria-label="Search examples"
              />
              <Button type="submit" variant="outline">
                Search
              </Button>
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setSearch("");
                    setSearchQuery("");
                  }}
                >
                  Clear
                </Button>
              )}
            </form>

            {/* Results */}
            {loading && (
              <div className="examples-loading">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="example-skeleton">
                    <div
                      className="skeleton"
                      style={{
                        height: "1.5rem",
                        width: "60%",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <div
                      className="skeleton"
                      style={{ height: "1rem", width: "80%" }}
                    />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <Card variant="outlined" padding="md" className="examples-error">
                <Badge colorScheme="error" variant="subtle">
                  Connection Error
                </Badge>
                <Typography
                  variant="body2"
                  color="muted"
                  style={{ marginTop: "0.5rem" }}
                >
                  {error}. Make sure the backend is running at{" "}
                  <code>
                    {import.meta.env.VITE_API_URL ?? "http://localhost:8080"}
                  </code>
                  .
                </Typography>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  style={{ marginTop: "0.75rem" }}
                >
                  Retry
                </Button>
              </Card>
            )}

            {!loading && !error && data && (
              <>
                <div className="examples-meta">
                  <Typography variant="caption" color="muted">
                    {data.pagination.total} result
                    {data.pagination.total !== 1 ? "s" : ""}
                  </Typography>
                </div>
                {data.data.length === 0 ? (
                  <Card
                    variant="filled"
                    padding="lg"
                    className="examples-empty"
                  >
                    <Typography variant="body1" color="muted" align="center">
                      No examples found. Create one using the form.
                    </Typography>
                  </Card>
                ) : (
                  <div className="examples-list">
                    {data.data.map((example: Example) => (
                      <ExampleCard
                        key={example.id}
                        example={example}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

function ExampleCard({
  example,
  onDelete,
}: {
  example: Example;
  onDelete: (id: string) => void;
}) {
  return (
    <Card
      variant="default"
      padding="md"
      header={
        <div className="example-card__header">
          <Typography variant="h5" truncate>
            {example.title}
          </Typography>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(example.id)}
            aria-label={`Delete ${example.title}`}
          >
            ✕
          </Button>
        </div>
      }
    >
      {example.description && (
        <Typography
          variant="body2"
          color="muted"
          className="example-card__desc"
        >
          {example.description}
        </Typography>
      )}
      <div className="example-card__footer">
        <div className="example-card__tags">
          {example.tags.map((tag) => (
            <Badge key={tag} colorScheme="neutral" variant="subtle" pill>
              {tag}
            </Badge>
          ))}
        </div>
        <Typography variant="caption" color="muted">
          {new Date(example.createdAt).toLocaleDateString()}
        </Typography>
      </div>
    </Card>
  );
}
