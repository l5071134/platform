<?php

namespace Oro\Bundle\EntityBundle\ORM;

interface DatabasePlatformInterface
{
    const DATABASE_POSTGRESQL = 'pgsql';
    const DATABASE_MYSQL      = 'mysql';

    const DATABASE_PLATFORM_POSTGRESQL = 'postgresql';
}
