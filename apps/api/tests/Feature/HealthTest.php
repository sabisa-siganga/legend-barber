<?php

it('returns an ok health payload', function () {
    $this->getJson('/api/health')
        ->assertOk()
        ->assertExactJson([
            'status' => 'ok',
            'service' => 'legend-barber-api',
        ]);
});
