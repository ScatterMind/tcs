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
  let current = null;
  let completed = [];

  function draw() {
    const categories = [];
    if ($("cat-trade").checked) categories.push("trade");
    if ($("cat-redflag").checked) categories.push("redflag");
    if (categories.length === 0) {
      $("scenario-card").hidden = true;
      const empty = $("empty-state");
      empty.hidden = false;
      empty.textContent = "Select at least one category to draw a drill.";
      current = null;
      return;
    }
    const tier = $("tier-filter").value;
    current = window.TCSDrills.generate({ categories, tier });
    renderScenario(current);
  }

  $("generate").addEventListener("click", draw);
  $("skip").addEventListener("click", draw);

  $("complete").addEventListener("click", () => {
    if (current) recordCompleted(current);
    draw();
  });

  $("reveal").addEventListener("click", () => {
    const panel = $("handling");
    const btn = $("reveal");
    panel.hidden = !panel.hidden;
    btn.textContent = panel.hidden
      ? "Reveal expected handling"
      : "Hide expected handling";
  });

  function recordCompleted(s) {
    completed.unshift({ category: s.category, context: s.context, line: s.line });
    completed = completed.slice(0, 10);
    renderCompleted();
  }

  function renderCompleted() {
    const ol = $("completed-list");
    const empty = $("completed-empty");
    ol.innerHTML = "";
    if (!completed.length) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    completed.forEach((c) => {
      const li = document.createElement("li");
      const chip = document.createElement("span");
      chip.className = "chip chip-" + c.category;
      chip.textContent = c.category === "redflag" ? "no-KYC" : "basic";
      li.appendChild(chip);
      const txt = document.createElement("span");
      txt.textContent =
        (c.context ? c.context + " — " : "") + "“" + c.line + "”";
      li.appendChild(txt);
      ol.appendChild(li);
    });
  }

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
