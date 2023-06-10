<?php

namespace App\Services;

use Unsplash\HttpClient;
use Unsplash\Photo;


class UnsplashService
{
  public function __construct(string $access)
  {
    HttpClient::init(['applicationId' => $access, 'utmSource' => 'saphpron']);
  }

  public function getPlaceholderPhoto(): string
  {
    $filters = [
      'query'    => 'food',
      'w'        => 300,
      'h'        => 300
    ];
    $photo = Photo::random($filters);

    if ($photo) {
      return $photo->download();
    } else {
      return '';
    }
  }
}
