<?php
declare(strict_types=1);
require_once __DIR__ . '/agregar-resultados.php';
header('Cache-Control: no-store');
$all = ($_GET['envios'] ?? '') === 'todos';
$report = agregarResultados(__DIR__ . '/resultados', $all);
function renderTable(array $rows, array $labels, array $topics, string $heading): void
{
    echo '<div class="table-scroll"><table><caption>' . $heading . '</caption><thead><tr><th scope="col">Grupo</th>';
    foreach ($topics as $label) {
        echo '<th scope="col">' . $label . '</th>';
    }
    echo '</tr></thead><tbody>';
    foreach ($rows as $key => $values) {
        echo '<tr><th scope="row">' . $labels[$key] . '</th>';
        foreach ($values as $stat) {
            if ($stat['quantidade'] === 0) {
                echo '<td><span class="muted">Sem notas</span></td>';
                continue;
            }
            $average = $stat['soma'] / $stat['quantidade'];
            echo '<td><strong>' . number_format($average, 2, ',', '.') . '</strong><span class="muted"> / 5</span>';
            echo '<div class="bar" aria-hidden="true"><span style="width:' . number_format($average * 20, 2, '.', '') . '%"></span></div>';
            echo '<small>' . $stat['quantidade'] . ' notas</small></td>';
        }
        echo '</tr>';
    }
    echo '</tbody></table></div>';
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resultados da pesquisa | Comparativo de LLMs</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, system-ui, sans-serif; background: #0b0f19; color: #f1f5f9; }
    * { box-sizing: border-box; }
    body { margin: 0; line-height: 1.6; }
    main { max-width: 1200px; margin: auto; padding: 40px 24px 64px; }
    a { color: #7dd3fc; }
    h1 { font-size: clamp(1.8rem, 4vw, 2.6rem); margin: 20px 0 8px; }
    h2 { font-size: 1.3rem; margin-bottom: 4px; }
    p { color: #b4c2d5; margin-top: 0; }
    .toolbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin: 24px 0; }
    select, button { font: inherit; padding: 10px 14px; border-radius: 8px; border: 1px solid #42516b; background: #18243a; color: #fff; }
    button { background: #1d4ed8; cursor: pointer; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .stat, section { border: 1px solid #29364d; border-radius: 14px; background: #131b2e; }
    .stat { padding: 18px; color: #b4c2d5; }
    .stat strong { display: block; color: #fff; font-size: 1.9rem; }
    section { padding: 20px; margin: 24px 0; }
    .table-scroll { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 640px; text-align: left; }
    caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    th, td { padding: 16px 12px; border-bottom: 1px solid #29364d; }
    thead th { color: #b4c2d5; font-size: .85rem; }
    tbody tr:last-child > * { border-bottom: 0; }
    td { width: 25%; }
    td strong { font-size: 1.2rem; }
    small, .muted { color: #b4c2d5; }
    .bar { height: 5px; background: #29364d; border-radius: 5px; margin: 7px 0 3px; }
    .bar span { display: block; height: 100%; background: #38bdf8; border-radius: inherit; }
    .notice { padding: 14px 18px; border-left: 3px solid #38bdf8; background: #14243a; }
    @media (max-width: 650px) { main { padding: 24px 14px; } .stats { grid-template-columns: repeat(2, 1fr); } section { padding: 12px; } select { max-width: 100%; } }
  </style>
</head>
<body>
<main>
  <a href="./index.html">← Voltar às avaliações</a>
  <h1>Resultados da pesquisa</h1>
  <p>Médias de coerência visual, experiência do usuário e atratividade estética, na escala de 1 a 5.</p>
  <form method="get" class="toolbar">
    <label for="envios">Considerar</label>
    <select id="envios" name="envios">
      <option value="recentes" <?= !$all ? 'selected' : '' ?>>Último envio por participante</option>
      <option value="todos" <?= $all ? 'selected' : '' ?>>Todos os envios</option>
    </select>
    <button type="submit">Atualizar resultados</button>
  </form>
  <div class="stats">
    <div class="stat"><strong><?= $report['participantes'] ?></strong>Participantes</div>
    <div class="stat"><strong><?= $report['envios'] ?></strong>Envios considerados</div>
    <div class="stat"><strong><?= $report['notas'] ?></strong>Notas consideradas</div>
    <div class="stat"><strong><?= $report['arquivos'] ?></strong>Arquivos encontrados</div>
  </div>
  <?php if (!$report['notas']): ?>
    <p class="notice">Ainda não há avaliações válidas para calcular as médias. Envie uma avaliação e atualize esta página.</p>
  <?php endif; ?>
  <?php if ($report['ignorados']): ?>
    <p class="notice"><?= $report['ignorados'] ?> arquivo(s) ignorado(s) por não conterem uma avaliação legível, identificada e com notas válidas.</p>
  <?php endif; ?>
  <section>
    <h2>Médias por LLM</h2>
    <p>Notas dos três níveis de prompt agrupadas por modelo.</p>
    <?php renderTable($report['porLLM'], $report['modelos'], $report['criterios'], 'Médias por LLM'); ?>
  </section>
  <section>
    <h2>Médias por prompt</h2>
    <p>Notas dos três modelos agrupadas por nível de prompt.</p>
    <?php renderTable($report['porPrompt'], [1 => 'Prompt 1 · Básico', 2 => 'Prompt 2 · Intermediário', 3 => 'Prompt 3 · Avançado'], $report['criterios'], 'Médias por nível de prompt'); ?>
  </section>
  <section>
    <h2>Médias por LLM e prompt</h2>
    <p>Comparação das nove combinações avaliadas.</p>
    <?php
    $labels = [];
    foreach ($report['modelos'] as $model => $label) {
        for ($p = 1; $p <= 3; $p++) {
            $labels["$model-p$p"] = "$label · Prompt $p";
        }
    }
    renderTable($report['porCombinacao'], $labels, $report['criterios'], 'Médias por LLM e prompt');
    ?>
  </section>
  <h2>Como as médias são calculadas</h2>
  <p>Cada média é a soma das notas válidas dividida pela quantidade de notas do critério naquele grupo.
    Notas ausentes ou inválidas não entram no cálculo; não são tratadas como zero. Os valores são arredondados para duas casas decimais apenas na exibição.</p>
  <p>O nome identifica o participante, ignorando maiúsculas e espaços repetidos.
    <?= $all ? 'Todos os envios estão incluídos: quem respondeu mais de uma vez terá mais peso nas médias.' : 'Apenas a avaliação válida mais recente de cada nome é considerada. Envios anteriores desconsiderados: ' . $report['substituidos'] . '.' ?>
    A data de envio define a ordem; para arquivos antigos, é usada a data de exportação ou de modificação do arquivo.</p>
</main>
</body>
</html>
