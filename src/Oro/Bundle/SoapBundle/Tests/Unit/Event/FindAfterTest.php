<?php

namespace Oro\Bundle\SoapBundle\Tests\Unit\Event;

use Oro\Bundle\SoapBundle\Event\FindAfter;

class FindAfterTest extends \PHPUnit\Framework\TestCase
{
    public function testGetEntity()
    {
        $testEntity = new \stdClass();
        $event = new FindAfter($testEntity);
        $this->assertSame($testEntity, $event->getEntity());
    }
}
