/* UI glue for the drill widget. */

(function () {
  const $ = (id) => document.getElementById(id);

  // Tabs
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  function activateTab(name) {
    document.querySelectorAll(".tab").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.tab === name ? "true" : "false");
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
    const categories = [];
    if ($("cat-trade").checked) categories.push("trade");
    if ($("cat-redflag").checked) categories.push("redflag");
    if (categories.length === 0) {
      $("scenario-card").hidden = true;
      const empty = $("empty-state");
      empty.hidden = false;
      empty.textContent = "Select at least one category to draw a drill.";
      return;
    }
    const tier = $("tier-filter").value;
    renderScenario(window.TCSDrills.generate({ categories, tier }));
  });

  $("reveal").addEventListener("click", () => {
    const panel = $("handling");
    const btn = $("reveal");
    panel.hidden = !panel.hidden;
    btn.textContent = panel.hidden
      ? "Reveal expected handling"
      : "Hide expected handling";
  });

  function renderScenario(s) {
    $("empty-state").hidden = true;
    $("scenario-card").hidden = false;
    $("scenario-card").dataset.category = s.category;
    $("scenario-tag").textContent = s.tag;
    $("customer-line").textContent = s.line;
    $("scenario-context").textContent = s.context || "";

    fillList($("clarify"), s.clarify);

    // Math section only applies to trade mechanics; hide it otherwise.
    const mathSection = $("math-section");
    if (s.math) {
      mathSection.hidden = false;
      $("math").textContent = s.math;
    } else {
      mathSection.hidden = true;
      $("math").textContent = "";
    }

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
