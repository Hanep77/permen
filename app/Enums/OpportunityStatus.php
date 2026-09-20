<?php

namespace App\Enums;

enum OpportunityStatus: string
{
    case New = 'new';
    case Considering = 'considering';
    case Pursuing = 'persuing';
    case Won = 'won';
    case Rejected = 'rejected';
    case Expired = 'expired';

    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::Considering => 'Considering',
            self::Pursuing => 'Pursuing',
            self::Won => 'Won',
            self::Rejected => 'Rejected',
            self::Expired => 'Expired',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::New => 'gray',
            self::Considering => 'yellow',
            self::Pursuing => 'blue',
            self::Won => 'green',
            self::Rejected => 'red',
            self::Expired => 'gray',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
