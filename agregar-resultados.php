<?php
declare(strict_types=1);

function agregarResultados(string $directory, bool $all = false): array
{
    $models = ['claude' => 'Claude', 'gemini' => 'Gemini', 'gpt' => 'GPT-OSS'];
    $topics = ['coerenciaVisual' => 'Coerência visual', 'experienciaUsuario' => 'Experiência do usuário (UX)', 'atratividadeEstetica' => 'Atratividade estética'];
    $empty = array_fill_keys(array_keys($topics), ['soma' => 0, 'quantidade' => 0]);
    $byModel = array_fill_keys(array_keys($models), $empty);
    $byPrompt = array_fill_keys([1, 2, 3], $empty);
    $byCombination = [];
    foreach ($models as $model => $_) {
        for ($p = 1; $p <= 3; $p++) {
            $byCombination["$model-p$p"] = $empty;
        }
    }

    $files = glob($directory . '/*.json') ?: [];
    $entries = [];
    $ignored = 0;
    foreach ($files as $file) {
        $content = @file_get_contents($file);
        $data = $content === false ? null : json_decode($content, true);
        if (!is_array($data) || !is_string($data['avaliador'] ?? null) || !is_array($data['resultados'] ?? null)) {
            $ignored++;
            continue;
        }
        $name = trim(preg_replace('/\s+/u', ' ', $data['avaliador']));
        if (class_exists('Normalizer')) {
            $name = Normalizer::normalize($name, Normalizer::FORM_C);
        }
        $name = mb_strtolower($name, 'UTF-8');
        $scores = [];
        foreach ($byCombination as $id => $_) {
            $ratings = $data['resultados'][$id]['avaliacoes'] ?? null;
            if (!is_array($ratings)) {
                continue;
            }
            foreach ($topics as $topic => $_label) {
                $value = $ratings[$topic] ?? null;
                if (is_int($value) && $value >= 1 && $value <= 5) {
                    $scores[$id][$topic] = $value;
                }
            }
        }
        if ($name === '' || !$scores) {
            $ignored++;
            continue;
        }
        $date = $data['dataEnvio'] ?? $data['dataExportacao'] ?? null;
        $timestamp = is_string($date) ? strtotime($date) : false;
        $entries[] = ['nome' => $name, 'notas' => $scores,
            'data' => $timestamp === false ? filemtime($file) : $timestamp,
            'modificado' => filemtime($file), 'arquivo' => basename($file)];
    }
    // Most recent valid submission wins; file metadata breaks timestamp ties.
    usort($entries, static function (array $a, array $b): int {
        return [$b['data'], $b['modificado'], $b['arquivo']] <=> [$a['data'], $a['modificado'], $a['arquivo']];
    });
    $participants = [];
    $selected = [];
    foreach ($entries as $entry) {
        if ($all || !isset($participants[$entry['nome']])) {
            $selected[] = $entry;
        }
        $participants[$entry['nome']] = true;
    }
    $count = 0;
    foreach ($selected as $entry) {
        foreach ($entry['notas'] as $id => $ratings) {
            [$model, $prompt] = explode('-p', $id);
            foreach ($ratings as $topic => $value) {
                $byModel[$model][$topic]['soma'] += $value;
                $byModel[$model][$topic]['quantidade']++;
                $byPrompt[(int) $prompt][$topic]['soma'] += $value;
                $byPrompt[(int) $prompt][$topic]['quantidade']++;
                $byCombination[$id][$topic]['soma'] += $value;
                $byCombination[$id][$topic]['quantidade']++;
                $count++;
            }
        }
    }
    return ['modelos' => $models, 'criterios' => $topics, 'porLLM' => $byModel,
        'porPrompt' => $byPrompt, 'porCombinacao' => $byCombination,
        'arquivos' => count($files), 'ignorados' => $ignored, 'participantes' => count($participants),
        'envios' => count($selected), 'substituidos' => count($entries) - count($selected), 'notas' => $count];
}
