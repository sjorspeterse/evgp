<?php

namespace App\WebSockets;

use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;
use Illuminate\Support\Facades\Log;

use BeyondCode\LaravelWebSockets\Apps\App;
use BeyondCode\LaravelWebSockets\QueryParameters;
use BeyondCode\LaravelWebSockets\WebSockets\Exceptions\UnknownAppKey;



class CustomWebsocketHandler implements MessageComponentInterface
{

    public function onOpen(ConnectionInterface $connection)
    {
        Log::debug("Opening websocket handler");
        $this
            ->verifyAppKey($connection)
            ->generateSocketId($connection);
        $connection->send("Hi, man!");

        // TODO: Implement onOpen() method.
    }
    
    public function onClose(ConnectionInterface $connection)
    {
        Log::debug("Closing websocket handler");
        // TODO: Implement onClose() method.
    }

    public function onError(ConnectionInterface $connection, \Exception $e)
    {
        Log::debug("Error on websocket: " . $e);
        // TODO: Implement onError() method.
    }

    public function onMessage(ConnectionInterface $connection, MessageInterface $msg)
    {
        Log::debug("New message on webSocket");
        // TODO: Implement onMessage() method.
    }

    protected function verifyAppKey(ConnectionInterface $connection)
    {
        $appKey = QueryParameters::create($connection->httpRequest)->get('appId');
        Log::debug("Found appKey! It is: " . $appKey);

        if (! $app = App::findByKey($appKey)) {
            Log::debug("Did not find an app with that key");
            throw new UnknownAppKey($appKey);
        }

        Log::debug("Found app as well!");

        $connection->app = $app;
        Log::debug("Set the connection to include the app");

        return $this;
    }

    protected function generateSocketId(ConnectionInterface $connection)
    {
        $socketId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));

        $connection->socketId = $socketId;

        return $this;
    }
}