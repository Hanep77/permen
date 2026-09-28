<?php

test('root redirects to dashboard', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('dashboard', absolute: false));
});
