import { useBlocker } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { websitePricing } from "@/config/pricing-calculator";
import { pricingManagerCode, pricingManagerSessionKey } from "@/config/pricing-manager";
import {
  configurationSchema,
  explainValidation,
  pricingDraftKey,
  readPricingImport,
  savePricingDraft,
  pricingChanges,
  type PricingConfiguration,
  type PricingDraft,
  type ConfiguredItem,
} from "@/lib/pricing-calculator/configuration";
import { PricingContext } from "@/components/pricing-calculator/PricingContext";
import { CalculatorShell } from "@/components/pricing-calculator/CalculatorShell";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
const tiers = ["economic", "average", "lux"] as const;
const services = ["planning", "design", "alacarte"] as const;
const clone = <T,>(value: T): T => structuredClone(value);
const fresh = (): PricingDraft => ({
  schemaVersion: 1,
  baseCatalogVersion: websitePricing.catalogVersion,
  lastSavedAt: null,
  configuration: clone(websitePricing),
});
const inputClass = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";
function Field({
  label,
  value,
  onChange,
  numeric = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  numeric?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <input
        className={inputClass}
        type={numeric ? "number" : "text"}
        step={numeric ? "any" : undefined}
        value={typeof value === "number" && !Number.isFinite(value) ? "" : value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
export function PricingManager() {
  const [unlocked, setUnlocked] = useState(false),
    [ready, setReady] = useState(false),
    [code, setCode] = useState("");
  const [draft, setDraft] = useState<PricingDraft>(fresh),
    [saved, setSaved] = useState(JSON.stringify(fresh().configuration));
  const [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [item, setItem] = useState<ConfiguredItem | null>(null),
    [originalItem, setOriginalItem] = useState("");
  const [preview, setPreview] = useState<PricingConfiguration | null>(null),
    [incoming, setIncoming] = useState<PricingDraft | null>(null);
  const [importOpen, setImportOpen] = useState(false),
    [importText, setImportText] = useState("");
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState(""),
    [service, setService] = useState(""),
    [status, setStatus] = useState("");
  const config = draft.configuration;
  const itemDirty = !!item && JSON.stringify(item) !== originalItem;
  const dirty = JSON.stringify(config) !== saved || itemDirty;
  useBlocker({
    shouldBlockFn: () => dirty && !window.confirm("Leave and discard unsaved pricing changes?"),
    enableBeforeUnload: false,
  });
  useEffect(() => {
    try {
      setUnlocked(sessionStorage.getItem(pricingManagerSessionKey) === pricingManagerCode);
      const raw = localStorage.getItem(pricingDraftKey);
      if (raw) {
        const restored = readPricingImport(raw);
        setDraft(restored);
        setSaved(JSON.stringify(restored.configuration));
      }
    } catch (e) {
      setError(`Saved draft could not be loaded. It has not been overwritten. ${String(e)}`);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  function change(next: PricingConfiguration) {
    setDraft((d) => ({ ...d, configuration: next }));
    setMessage("");
  }
  function validate(next: PricingConfiguration) {
    const parsed = configurationSchema.safeParse(next);
    if (!parsed.success) {
      setError(explainValidation(parsed.error));
      return null;
    }
    setError("");
    return parsed.data;
  }
  function persist(next: PricingDraft) {
    const parsed = validate(next.configuration);
    if (!parsed) return false;
    try {
      const stored = savePricingDraft(localStorage, { ...next, configuration: parsed });
      setDraft(stored);
      setSaved(JSON.stringify(stored.configuration));
      setMessage("Saved on this device.");
      return true;
    } catch (e) {
      setError(
        `Not saved. Browser storage may be blocked or full. Your edits remain open. ${String(e)}`,
      );
      return false;
    }
  }
  function closeItem() {
    if (itemDirty && !window.confirm("Discard unsaved item changes?")) return;
    setItem(null);
  }
  function openItem(next: ConfiguredItem) {
    setItem(clone(next));
    setOriginalItem(JSON.stringify(next));
    setError("");
  }
  function lock() {
    if (
      dirty &&
      !window.confirm("Lock and discard unsaved changes? Saved drafts remain on this device.")
    )
      return;
    try {
      sessionStorage.removeItem(pricingManagerSessionKey);
      setUnlocked(false);
      setPreview(null);
      setItem(null);
      setDraft((d) => ({ ...d, configuration: JSON.parse(saved) }));
    } catch (e) {
      setError(`Could not clear the session: ${String(e)}`);
    }
  }
  function exportPricing() {
    if (item) {
      setError("Save or cancel the item editor first.");
      return;
    }
    const parsed = validate(config);
    if (!parsed) return;
    const blob = new Blob(
      [
        JSON.stringify(
          { ...draft, configuration: parsed, exportedAt: new Date().toISOString() },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "coco-cabana-pricing-export.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Export prepared. Shared website prices have not changed.");
  }
  const setItemField = <K extends keyof ConfiguredItem>(key: K, value: ConfiguredItem[K]) =>
    setItem((i) => (i ? { ...i, [key]: value } : i));
  if (!ready) return <div className="container py-20">Loading Pricing Manager…</div>;
  if (!unlocked)
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <h1 className="font-display text-3xl">Pricing Manager</h1>
        <p className="my-4">
          Disposable review access only. This frontend code and its checks can be inspected or
          bypassed. Do not use a personal password or enter confidential information.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code !== pricingManagerCode) {
              setError("Incorrect demo access code.");
              return;
            }
            try {
              sessionStorage.setItem(pricingManagerSessionKey, pricingManagerCode);
              setUnlocked(true);
              setError("");
              setCode("");
            } catch {
              setError(
                "Session storage is unavailable. Enable browser storage to unlock this review interface.",
              );
            }
          }}
        >
          <label>
            Demo access code
            <input
              className={inputClass}
              type="password"
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button className="cc-button mt-4" type="submit">
            Unlock pricing manager
          </button>
        </form>
        {error && (
          <p role="alert" className="my-4 text-destructive whitespace-pre-line">
            {error}
          </p>
        )}
      </div>
    );
  if (preview)
    return (
      <PricingContext.Provider value={{ configuration: preview, localPreview: true }}>
        <div className="sticky top-20 z-40 border-b bg-background p-3 flex flex-wrap items-center gap-3">
          <strong>Previewing local draft</strong>
          <span className="text-sm">
            Public website prices are unchanged. Saving estimates is disabled.
          </span>
          <button className="cc-button secondary" onClick={() => setPreview(null)}>
            Return to editing
          </button>
          <button onClick={lock}>Lock / Sign out</button>
        </div>
        <CalculatorShell />
      </PricingContext.Provider>
    );
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 pricing-manager">
      <div className="flex justify-between gap-4">
        <h1 className="font-display text-3xl">Pricing Manager</h1>
        <button className="underline" onClick={lock}>
          Lock / Sign out
        </button>
      </div>
      <p className="my-4 font-semibold">
        Changes are saved on this device. Export your changes to update the shared website.
      </p>
      <p className="text-sm text-muted-foreground">
        Drafts belong to this browser on this device. Clearing browser data can erase them. No sync
        or collaboration. This bypassable demo gate provides no account security. Do not enter
        private information.
      </p>
      <div className="sticky top-20 z-20 my-5 border rounded-lg bg-background p-3">
        <p role="status" className="mb-2 font-semibold">
          {dirty ? "Unsaved changes" : "No unsaved changes"}
          {draft.lastSavedAt
            ? ` · Last saved ${new Date(draft.lastSavedAt).toLocaleString()}`
            : " · Website prices loaded"}
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="cc-button" onClick={() => persist(draft)}>
            Save on this device
          </button>
          <button
            className="cc-button secondary"
            onClick={() => {
              const parsed = validate(config);
              if (parsed) setPreview(clone(parsed));
            }}
          >
            Preview changes
          </button>
          <button className="cc-button secondary" onClick={exportPricing}>
            Export pricing
          </button>
          <button
            className="cc-button secondary"
            onClick={() => {
              setImportOpen(true);
              setError("");
            }}
          >
            Import pricing
          </button>
          <button
            className="cc-button secondary"
            onClick={() => {
              if (
                window.confirm(
                  "Replace all local edits with website prices? This cannot be undone.",
                )
              )
                persist(fresh());
            }}
          >
            Reset to website prices
          </button>
        </div>
      </div>
      {draft.baseCatalogVersion !== websitePricing.catalogVersion && (
        <div role="alert" className="border border-amber-600 rounded p-4 mb-4">
          This draft started from {draft.baseCatalogVersion}; website prices are now{" "}
          {websitePricing.catalogVersion}. Review differences before exporting. Reset to website
          prices to start from the current version. Saving does not merge website updates.
        </div>
      )}
      {message && (
        <p role="status" className="my-3">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="my-3 text-destructive whitespace-pre-line">
          {error}
        </p>
      )}
      <section aria-label="Pricing items">
        <h2 className="text-xl font-semibold">Items</h2>
        <div className="grid sm:grid-cols-4 gap-3 my-4">
          <Field label="Search items" value={search} onChange={setSearch} />
          <label>
            Category
            <select
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {config.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Service
            <select
              className={inputClass}
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="">All services</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {config.services[s].name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Pricing status
            <select
              className={inputClass}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              {["reference", "approved", "missing"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <button
          className="cc-button secondary mb-3"
          onClick={() => {
            const next: ConfiguredItem = {
              id: `item-${crypto.randomUUID()}`,
              name: "New item",
              description: "",
              categoryId: "decor",
              displayOrder: config.items.length,
              hidden: false,
              calculationType: "flat",
              status: "missing",
              tiers: {},
              version: config.catalogVersion,
              audiences: ["client", "planner"],
              services: ["planning", "design", "alacarte"],
              inclusions: "",
              exclusions: "",
              pricingNotes: "",
            };
            setItem(next);
            setOriginalItem("");
          }}
        >
          Add item
        </button>
        <ul className="divide-y border rounded-lg">
          {config.items
            .filter(
              (i) =>
                (!category || i.categoryId === category) &&
                (!service || i.services.some((s) => s === service)) &&
                (!status || i.status === status) &&
                `${i.name} ${i.description}`.toLowerCase().includes(search.toLowerCase()),
            )
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((i) => (
              <li className="p-3 flex flex-wrap items-center gap-3" key={i.id}>
                <div className="flex-1 min-w-40">
                  <strong>{i.name}</strong>
                  <p className="text-xs text-muted-foreground">
                    {i.status} · {i.calculationType.replaceAll("_", " ")} ·{" "}
                    {i.hidden ? "Hidden" : "Visible"}
                  </p>
                </div>
                <button
                  className="cc-button secondary"
                  aria-label={`Edit ${i.name}`}
                  onClick={() => openItem(i)}
                >
                  Edit
                </button>
                <button
                  className="underline text-sm"
                  aria-label={`${i.hidden ? "Restore" : "Hide"} ${i.name}`}
                  onClick={() =>
                    change({
                      ...config,
                      items: config.items.map((o) =>
                        o.id === i.id ? { ...o, hidden: !o.hidden } : o,
                      ),
                    })
                  }
                >
                  {i.hidden ? "Restore" : "Hide"}
                </button>
              </li>
            ))}
        </ul>
      </section>
      <section className="my-8">
        <h2 className="text-xl font-semibold mb-3">Categories</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {config.categories.map((c, index) => (
            <div key={c.id} className="grid gap-2">
              <Field
                label={`${c.id} category name`}
                value={c.name}
                onChange={(v) =>
                  change({
                    ...config,
                    categories: config.categories.map((o, j) =>
                      j === index ? { ...o, name: v } : o,
                    ),
                  })
                }
              />
              <Field
                label={`${c.id} display order`}
                numeric
                value={c.displayOrder}
                onChange={(v) =>
                  change({
                    ...config,
                    categories: config.categories.map((o, j) =>
                      j === index ? { ...o, displayOrder: num(v) } : o,
                    ),
                  })
                }
              />
            </div>
          ))}
        </div>
      </section>
      <section className="my-8">
        <h2 className="text-xl font-semibold mb-3">Tier labels and descriptions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div key={t} className="grid gap-2">
              <Field
                label={`${t} label`}
                value={config.tierLabels[t]}
                onChange={(v) =>
                  change({ ...config, tierLabels: { ...config.tierLabels, [t]: v } })
                }
              />
              <Field
                label={`${t} description`}
                value={config.tierDescriptions[t]}
                onChange={(v) =>
                  change({ ...config, tierDescriptions: { ...config.tierDescriptions, [t]: v } })
                }
              />
            </div>
          ))}
        </div>
      </section>
      <section className="my-8">
        <h2 className="text-xl font-semibold mb-3">Calculator assumptions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {(
            ["guestsPerTable", "minGuests", "maxGuests", "minQuantity", "maxQuantity"] as const
          ).map((k) => (
            <Field
              key={k}
              label={k.replace(/([A-Z])/g, " $1")}
              numeric
              value={config.assumptions[k]}
              onChange={(v) =>
                change({ ...config, assumptions: { ...config.assumptions, [k]: num(v) } })
              }
            />
          ))}
        </div>
      </section>
      <section className="my-8">
        <h2 className="text-xl font-semibold mb-3">Service descriptions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s} className="grid gap-2">
              {(["name", "description", "detail"] as const).map((k) => (
                <Field
                  key={k}
                  label={`${s} ${k}`}
                  value={config.services[s][k]}
                  onChange={(v) =>
                    change({
                      ...config,
                      services: { ...config.services, [s]: { ...config.services[s], [k]: v } },
                    })
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-4 my-8">
        {(["disclaimer", "exclusions"] as const).map((k) => (
          <label className="grid gap-1" key={k}>
            {k}
            <textarea
              className={inputClass}
              rows={3}
              value={config[k]}
              onChange={(e) => change({ ...config, [k]: e.target.value })}
            />
          </label>
        ))}
      </section>
      <details className="border rounded-lg p-4 mb-8">
        <summary className="font-semibold cursor-pointer">Advanced fee settings</summary>
        <p className="my-3 text-sm">
          The lower band uses a percentage, the middle band a flat fee, and the upper band a
          percentage. Each estimate endpoint is calculated independently. Client Planning uses all
          selected priced items; Design uses décor and enhancements. Planners retain their optional
          own fee. A la carte has no fee.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {(Object.keys(config.fees) as (keyof typeof config.fees)[]).map((k) => (
            <Field
              key={k}
              label={k.replace(/([A-Z])/g, " $1")}
              numeric
              value={config.fees[k]}
              onChange={(v) => change({ ...config, fees: { ...config.fees, [k]: num(v) } })}
            />
          ))}
        </div>
      </details>
      <Dialog
        open={!!item}
        onOpenChange={(open) => {
          if (!open) closeItem();
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
          <DialogTitle>Edit pricing item</DialogTitle>
          <DialogDescription>
            Approval status belongs to this local draft. Saving does not publish it.
          </DialogDescription>
          {item && (
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const exists = config.items.some((i) => i.id === item.id);
                const next = {
                  ...config,
                  items: exists
                    ? config.items.map((i) => (i.id === item.id ? item : i))
                    : [...config.items, item],
                };
                if (persist({ ...draft, configuration: next })) setItem(null);
              }}
            >
              <p className="text-xs break-all">Stable ID: {item.id}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field
                  label="Item name"
                  value={item.name}
                  onChange={(v) => setItemField("name", v)}
                />
                <Field
                  label="Description"
                  value={item.description}
                  onChange={(v) => setItemField("description", v)}
                />
                <label>
                  Item category
                  <select
                    className={inputClass}
                    value={item.categoryId}
                    onChange={(e) =>
                      setItemField("categoryId", e.target.value as ConfiguredItem["categoryId"])
                    }
                  >
                    {config.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Display order"
                  numeric
                  value={item.displayOrder}
                  onChange={(v) => setItemField("displayOrder", num(v))}
                />
                <label>
                  Calculation basis
                  <select
                    className={inputClass}
                    value={item.calculationType}
                    onChange={(e) =>
                      setItem((i) =>
                        i
                          ? {
                              ...i,
                              calculationType: e.target.value as ConfiguredItem["calculationType"],
                              status: e.target.value === "custom_quote" ? "missing" : i.status,
                            }
                          : i,
                      )
                    }
                  >
                    {["flat", "per_guest", "per_table", "quantity", "custom_quote"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Item pricing status
                  <select
                    className={inputClass}
                    value={item.status}
                    onChange={(e) =>
                      setItemField("status", e.target.value as ConfiguredItem["status"])
                    }
                  >
                    {["reference", "approved", "missing"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>
              </div>
              <fieldset>
                <legend>Available audiences</legend>
                {(["client", "planner"] as const).map((a) => (
                  <label className="inline-flex mr-4 gap-2" key={a}>
                    <input
                      type="checkbox"
                      checked={item.audiences.includes(a)}
                      onChange={(e) =>
                        setItemField(
                          "audiences",
                          e.target.checked
                            ? [...item.audiences, a]
                            : item.audiences.filter((v) => v !== a),
                        )
                      }
                    />
                    {a}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Available services</legend>
                {services.map((s) => (
                  <label className="inline-flex mr-4 gap-2" key={s}>
                    <input
                      type="checkbox"
                      checked={item.services.includes(s)}
                      onChange={(e) =>
                        setItemField(
                          "services",
                          e.target.checked
                            ? [...item.services, s]
                            : item.services.filter((v) => v !== s),
                        )
                      }
                    />
                    {config.services[s].name}
                  </label>
                ))}
              </fieldset>
              {item.status === "missing" && (
                <p>
                  Custom quote required. Any retained tier values are excluded from estimates until
                  a priced status is selected.
                </p>
              )}
              {tiers.map((t) => (
                <fieldset key={t} className="grid grid-cols-2 gap-3">
                  <legend>{config.tierLabels[t]}</legend>
                  {(["minimum", "maximum"] as const).map((k) => (
                    <Field
                      key={k}
                      label={`${t} ${k}`}
                      numeric
                      value={item.tiers[t]?.[k] ?? NaN}
                      onChange={(v) =>
                        setItemField("tiers", {
                          ...item.tiers,
                          [t]: { minimum: NaN, maximum: NaN, ...item.tiers[t], [k]: num(v) },
                        })
                      }
                    />
                  ))}
                </fieldset>
              ))}
              {(["inclusions", "exclusions", "pricingNotes"] as const).map((k) => (
                <label className="grid gap-1" key={k}>
                  {k}
                  <textarea
                    className={inputClass}
                    value={item[k]}
                    onChange={(e) => setItemField(k, e.target.value)}
                  />
                </label>
              ))}
              {error && (
                <p role="alert" className="text-destructive whitespace-pre-line">
                  {error}
                </p>
              )}
              <p>{itemDirty ? "Unsaved item changes" : "Item unchanged"}</p>
              <div className="flex gap-3">
                <button className="cc-button" type="submit">
                  Save on this device
                </button>
                <button className="cc-button secondary" type="button" onClick={closeItem}>
                  Cancel
                </button>
                <button type="button" onClick={closeItem}>
                  Close
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogTitle>Import pricing</DialogTitle>
          <DialogDescription>
            Choose an exported JSON file, or paste its contents. Validation and a change summary
            come before replacement.
          </DialogDescription>
          <label className="text-sm">
            Choose pricing JSON file
            <input
              type="file"
              className="block w-full text-sm mt-2"
              accept=".json,application/json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                try {
                  if (file.size > 2000000) throw new Error("Maximum file size is 2 MB.");
                  setIncoming(readPricingImport(await file.text()));
                  setImportOpen(false);
                  setError("");
                } catch (err) {
                  setError(`Import rejected; current draft unchanged. ${String(err)}`);
                }
              }}
            />
          </label>
          <label className="grid gap-2">
            Or paste exported pricing JSON
            <textarea
              className={inputClass}
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
          </label>
          {error && (
            <p role="alert" className="text-destructive whitespace-pre-line">
              {error}
            </p>
          )}
          <button
            className="cc-button"
            onClick={() => {
              try {
                setIncoming(readPricingImport(importText));
                setImportOpen(false);
                setError("");
              } catch (e) {
                setError(`Import rejected; current draft unchanged. ${String(e)}`);
              }
            }}
          >
            Review pasted JSON
          </button>
          <button className="cc-button secondary" onClick={() => setImportOpen(false)}>
            Cancel import
          </button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!incoming}
        onOpenChange={(open) => {
          if (!open) setIncoming(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Replace local draft?</DialogTitle>
          <DialogDescription>
            {incoming ? pricingChanges(config, incoming.configuration) : ""} This replaces your
            current draft, including unsaved changes. Website prices remain unchanged.
          </DialogDescription>
          {incoming && (
            <p>
              Incoming base: {incoming.baseCatalogVersion}
              {incoming.baseCatalogVersion !== websitePricing.catalogVersion
                ? " — differs from this website; review required."
                : ""}
            </p>
          )}
          {error && <p role="alert">{error}</p>}
          <button
            className="cc-button"
            onClick={() => {
              if (incoming && persist(incoming)) setIncoming(null);
            }}
          >
            Confirm import
          </button>
          <button className="cc-button secondary" onClick={() => setIncoming(null)}>
            Cancel import
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
