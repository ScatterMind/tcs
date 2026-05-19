/* UI glue for the drill widget. */

(function () {
  const $ = (id) => document.getElementById(id);

  // Tabs
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  function activateTab(name) {
    document.querySelectorAll(".tab").forEach((b) => {
      const on = b.dataset.tab === name;
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.querySelectorAll(".tab-panel").forEach((p) => {
      const on = p.id === `tab-${name}`;
      p.hidden = !on;
      p.setAttribute("aria-hidden", on ? "false" : "true");
    });
    if (name === "flowchart") renderFlowchart();
  }

  // Drill
  $("generate").addEventListener("click", () => {
    const includeEdge = $("filter-edge").checked;
    const s = window.TCSDrills.pickScenario(includeEdge);
    renderScenario(s);
  });

  $("reveal").addEventListener("click", () => {
    const panel = $("handling");
    const btn = $("reveal");
    if (panel.hidden) {
      panel.hidden = false;
      btn.textContent = "Hide expected handling";
    } else {
      panel.hidden = true;
      btn.textContent = "Reveal expected handling";
    }
  });

  function renderScenario(s) {
    $("empty-state").hidden = true;
    $("scenario-card").hidden = false;
    $("scenario-tag").textContent = s.tag;
    $("customer-line").textContent = s.line;
    $("scenario-context").textContent = s.edge ? `Modifier: ${s.edge}` : "";

    fillList($("clarify"), s.clarify);
    $("math").textContent = s.math;
    fillList($("procedure"), s.procedure);
    fillList($("pitfalls"), s.pitfalls);

    $("handling").hidden = true;
    $("reveal").textContent = "Reveal expected handling";
  }

  function fillList(el, items) {
    el.innerHTML = "";
    items.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      el.appendChild(li);
    });
  }

  // Flowchart — lazy render on first tab activation
  let flowchartRendered = false;
  async function renderFlowchart() {
    if (flowchartRendered) return;
    if (!window.__mermaid) {
      // mermaid module not ready yet; retry shortly
      setTimeout(renderFlowchart, 100);
      return;
    }
    const target = $("mermaid-target");
    const { svg } = await window.__mermaid.render(
      "tcs-flow",
      window.TCSFlowchart.diagram
    );
    target.innerHTML = svg;
    flowchartRendered = true;
  }
})();
