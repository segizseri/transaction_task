<?php

namespace App\Services;

class CurrencyService
{
    private $apiUrl;

    public function __construct()
    {
        $this->apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
    }

    public function getRates(array $currencies)
    {
        $url = $this->apiUrl;
        $response = file_get_contents($url);

        if ($response === false) {
            throw new \Exception('Ошибка получения данных с API');
        }
        $rates = [];
        $data = json_decode($response, true);

        if (!isset($data['rates'])) {
            throw new \Exception('Некорректный ответ API');
        }
        foreach ($data['rates'] as $key => $rate) {
            if (in_array($key, $currencies)) {
                $rates[] = [
                    'currency' => $key,
                    'amount' => $rate
                ];
            }
        }

        return $rates;
    }
}
