<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function fail(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['sucesso' => false, 'erro' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    fail(405, 'Utilize POST para enviar a avaliação.');
}

$body = file_get_contents('php://input', false, null, 0, 65537);
if ($body === false || strlen($body) > 65536) {
    fail(413, 'Avaliação muito grande.');
}
$input = json_decode($body, true);
if (!is_array($input)) {
    fail(400, 'JSON inválido.');
}
$name = $input['avaliador'] ?? null;
if (!is_string($name)) {
    fail(422, 'Informe o nome do avaliador.');
}
$name = trim(preg_replace('/\s+/u', ' ', $name));
if ($name === '' || mb_strlen($name, 'UTF-8') > 150) {
    fail(422, 'O nome deve ter entre 1 e 150 caracteres.');
}
$role = $input['trabalhaComTechDesign'] ?? null;
if (!in_array($role, ['Sim', 'Não'], true)) {
    fail(422, 'Informe se trabalha com tecnologia ou design.');
}
$results = $input['resultados'] ?? null;
if (!is_array($results) || count($results) !== 9) {
    fail(422, 'Avalie todos os 9 prompts.');
}
$validated = [];
foreach (['claude' => 'Claude', 'gemini' => 'Gemini', 'gpt' => 'GPT-OSS'] as $model => $title) {
    for ($prompt = 1; $prompt <= 3; $prompt++) {
        $id = "$model-p$prompt";
        $scores = $results[$id]['avaliacoes'] ?? null;
        if (!is_array($scores) || count($scores) !== 3) {
            fail(422, 'Preencha as três notas de cada prompt.');
        }
        $ratings = [];
        foreach (['coerenciaVisual', 'experienciaUsuario', 'atratividadeEstetica'] as $topic) {
            $score = $scores[$topic] ?? null;
            if (!is_int($score) || $score < 1 || $score > 5) {
                fail(422, 'As notas devem ser números inteiros de 1 a 5.');
            }
            $ratings[$topic] = $score;
        }
        $validated[$id] = ['id' => $id, 'titulo' => "$title - Prompt $prompt",
            'modelo' => strtoupper($model), 'avaliacoes' => $ratings];
    }
}

$data = ['avaliador' => $name, 'trabalhaComTechDesign' => $role,
    'dataEnvio' => gmdate('c'), 'totalPromptsAvaliados' => 9, 'resultados' => $validated];
$directory = __DIR__ . '/resultados';
if (!is_dir($directory) && !@mkdir($directory, 0775, true) && !is_dir($directory)) {
    fail(500, 'Não foi possível criar a pasta de resultados.');
}
// The suffix distinguishes submissions, never participants. Identity is only the name.
$safeName = preg_replace('/[^a-z0-9]+/', '_', strtolower(iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name)));
$safeName = substr(trim($safeName, '_'), 0, 80) ?: 'avaliador';
$filename = 'avaliacao_' . $safeName . '_' . gmdate('Ymd_His') . '_' . bin2hex(random_bytes(8)) . '.json';
$json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false || @file_put_contents($directory . '/' . $filename, $json . PHP_EOL, LOCK_EX) === false) {
    fail(500, 'Não foi possível gravar a avaliação.');
}
http_response_code(201);
echo json_encode(['sucesso' => true], JSON_UNESCAPED_UNICODE);
