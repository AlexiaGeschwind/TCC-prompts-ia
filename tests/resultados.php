<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/agregar-resultados.php';

function check(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}
function fixture(string $name, string $date, int $score): array
{
    $results = [];
    foreach (['claude', 'gemini', 'gpt'] as $model) {
        for ($p = 1; $p <= 3; $p++) {
            $results["$model-p$p"] = ['avaliacoes' => array_fill_keys(
                ['coerenciaVisual', 'experienciaUsuario', 'atratividadeEstetica'], $score)];
        }
    }
    return ['avaliador' => $name, 'dataEnvio' => $date, 'resultados' => $results];
}
$directory = sys_get_temp_dir() . '/tcc-resultados-' . bin2hex(random_bytes(8));
mkdir($directory);
try {
    $empty = agregarResultados($directory);
    check($empty['notas'] === 0 && $empty['envios'] === 0, 'Empty directory');
    file_put_contents("$directory/old.json", json_encode(fixture(' Ana   Silva ', '2026-01-01', 1)));
    file_put_contents("$directory/new.json", json_encode(fixture('ANA SILVA', '2026-01-02', 5)));
    file_put_contents("$directory/other.json", json_encode(fixture('Bruno', '2026-01-03', 3)));
    file_put_contents("$directory/broken.json", '{');
    $report = agregarResultados($directory);
    check($report['participantes'] === 2 && $report['envios'] === 2, 'Names identify participants');
    check($report['substituidos'] === 1 && $report['ignorados'] === 1, 'Duplicates and malformed files');
    check($report['notas'] === 54, 'Complete submissions have 27 scores');
    foreach (['porLLM', 'porPrompt', 'porCombinacao'] as $group) {
        foreach ($report[$group] as $criteria) {
            foreach ($criteria as $stat) {
                check($stat['soma'] / $stat['quantidade'] == 4, 'Expected average 4 for ' . $group);
            }
        }
    }
    $all = agregarResultados($directory, true);
    check($all['envios'] === 3 && $all['notas'] === 81, 'All submissions option');
    check($all['porLLM']['claude']['coerenciaVisual']['soma'] === 27, 'All submissions sum');

    $partial = fixture('Carla', '2026-01-04', 2);
    $partial['resultados'] = ['claude-p1' => ['avaliacoes' => [
        'coerenciaVisual' => 2, 'experienciaUsuario' => null, 'atratividadeEstetica' => 6]]];
    file_put_contents("$directory/partial.json", json_encode($partial));
    $report = agregarResultados($directory);
    check($report['notas'] === 55, 'Invalid and missing scores excluded');
    check($report['porCombinacao']['claude-p1']['coerenciaVisual'] === ['soma' => 10, 'quantidade' => 3], 'Partial score denominator');
    check($report['porCombinacao']['claude-p1']['experienciaUsuario']['quantidade'] === 2, 'Missing score is not zero');
    echo "PASS: empty results, averages, duplicate names, all submissions, malformed JSON and partial scores\n";
} finally {
    foreach (glob($directory . '/*.json') as $file) {
        unlink($file);
    }
    rmdir($directory);
}
