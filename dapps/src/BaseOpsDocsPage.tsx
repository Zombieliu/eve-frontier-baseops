import { frontierMedia } from "./frontierMedia";
import { useI18n } from "./i18n";

export function BaseOpsDocsPage({
  onOpenConsole,
}: {
  onOpenConsole: (anchor?: string) => void;
}) {
  const { m } = useI18n();
  const docsQuickLinks = [
    { label: m.docs.quickLinks[0], id: "docs-start-here" },
    { label: m.docs.quickLinks[1], id: "docs-operate" },
    { label: m.docs.quickLinks[2], id: "docs-reference" },
  ] as const;
  const referenceItems = [
    {
      label: m.docs.sections.reference.labels[0],
      value: "0x284dde8463dc1888671287ff330d1cc6757c08b56c19cbef3fe85e0c1447f9d2",
    },
    {
      label: m.docs.sections.reference.labels[1],
      value: "0x522f00da02494c4bc6feddb4d3a964c822cfdf0fb439849f074544b59ed86882",
    },
    {
      label: m.docs.sections.reference.labels[2],
      value: "0x25a3ca9edd24a19be1cb7874844d14ebcc982679c180316c82c12581d1445e93",
    },
    {
      label: m.docs.sections.reference.labels[3],
      value: "Gate 90185 -> Gate 90186",
    },
  ] as const;

  return (
    <div className="cmd-docs-page" id="docs-home">
      <section className="cmd-docs-hero">
        <div className="cmd-docs-hero-copy">
          <div className="cmd-docs-pill">{m.docs.pill}</div>
          <p className="cmd-docs-kicker">{m.docs.kicker}</p>
          <h1>{m.docs.title}</h1>
          <p>{m.docs.description}</p>
          <div className="cmd-docs-actions">
            <button className="cmd-primary-cta" onClick={() => onOpenConsole("operator-manual")} type="button">
              {m.docs.actions.quickstart}
            </button>
            <button className="cmd-secondary-cta" onClick={() => onOpenConsole("proof-timeline")} type="button">
              {m.docs.actions.proof}
            </button>
          </div>
        </div>
        <div className="cmd-docs-hero-visual">
          <img alt="Frontier launch art" src={frontierMedia.launchArtHorizontal} />
        </div>
      </section>

      <section className="cmd-docs-nav-band">
        {docsQuickLinks.map((link) => (
          <button
            className="cmd-docs-nav-link"
            key={link.id}
            onClick={() =>
              document.getElementById(link.id)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            type="button"
          >
            {link.label}
          </button>
        ))}
      </section>

      <section className="cmd-docs-section" id="docs-start-here">
        <div className="cmd-docs-section-header">
          <p className="cmd-docs-section-kicker">{m.docs.sections.start.kicker}</p>
          <h2>{m.docs.sections.start.title}</h2>
        </div>
        <div className="cmd-docs-card-grid">
          {m.docs.sections.start.cards.map((card) => (
            <article className="cmd-docs-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cmd-docs-section" id="docs-operate">
        <div className="cmd-docs-section-header">
          <p className="cmd-docs-section-kicker">{m.docs.sections.operate.kicker}</p>
          <h2>{m.docs.sections.operate.title}</h2>
        </div>
        <div className="cmd-docs-steps">
          {m.docs.sections.operate.steps.map((step, index) => (
            <article className="cmd-docs-step" key={step}>
              <div className="cmd-docs-step-index">0{index + 1}</div>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cmd-docs-section" id="docs-reference">
        <div className="cmd-docs-section-header">
          <p className="cmd-docs-section-kicker">{m.docs.sections.reference.kicker}</p>
          <h2>{m.docs.sections.reference.title}</h2>
        </div>
        <div className="cmd-docs-reference-grid">
          {referenceItems.map((item) => (
            <article className="cmd-docs-reference-card" key={item.label}>
              <span>{item.label}</span>
              <code>{item.value}</code>
            </article>
          ))}
        </div>

        <div className="cmd-judge-card cmd-docs-judge-card">
          <div className="cmd-log-header">
            <h3>{m.console.manual.judgeTitle}</h3>
          </div>
          <div className="cmd-judge-lines">
            {m.console.manual.judgeLines.map((line, index) => (
              <div className="cmd-judge-line" key={line}>
                <span className="cmd-judge-index">0{index + 1}</span>
                <p>{line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
