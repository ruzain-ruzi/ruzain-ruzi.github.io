// Served only by `node scripts/serve.mjs --audit`; never included in deployable pages.
window.addEventListener('load', async () => {
  const result = await window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] }
  });
  const output = document.createElement('pre');
  output.id = 'accessibility-audit';
  output.textContent = JSON.stringify({
    violations: result.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })),
    passes: result.passes.length,
    incomplete: result.incomplete.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))
  });
  document.body.append(output);
});
