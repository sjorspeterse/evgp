<?php

namespace App\WebSockets;

use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;
use Illuminate\Support\Facades\Log;

class CustomWebsocketHandler implements MessageComponentInterface
{

    public function onOpen(ConnectionInterface $connection)
    {
        Log::debug("Opening websocket handler");
        // TODO: Implement onOpen() method.
    }
    
    public function onClose(ConnectionInterface $connection)
    {
        Log::debug("Closing websocket handler");
        // TODO: Implement onClose() method.
    }

    public function onError(ConnectionInterface $connection, \Exception $e)
    {
        Log::debug("Error on websocketet");
        Log::debug("Message: " . $e);
        // TODO: Implement onError() method.
    }

    public function onMessage(ConnectionInterface $connection, MessageInterface $msg)
    {
        Log::debug("New message on webSocket");
        // TODO: Implement onMessage() method.
    }
}