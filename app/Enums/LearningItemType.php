<?php

namespace App\Enums;

enum LearningItemType: string
{
    case Book = 'book';
    case Course = 'course';
    case Tutorial = 'tutorial';
    case Paper = 'paper';
    case Article = 'article';
    case Video = 'video';
    case Documentation = 'documentation';
    case Website = 'website';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Book => 'Book',
            self::Course => 'Course',
            self::Tutorial => 'Tutorial',
            self::Paper => 'Paper',
            self::Article => 'Article',
            self::Video => 'Video',
            self::Documentation => 'Documentation',
            self::Website => 'Website',
            self::Other => 'Other',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
