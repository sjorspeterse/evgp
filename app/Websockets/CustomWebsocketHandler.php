<?php

namespace App\WebSockets;

use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;
use Illuminate\Support\Facades\Log;

use BeyondCode\LaravelWebSockets\Apps\App;
use BeyondCode\LaravelWebSockets\QueryParameters;
use BeyondCode\LaravelWebSockets\WebSockets\Exceptions\UnknownAppKey;

use App\User;


class CustomWebsocketHandler implements MessageComponentInterface
{
    private $userList = array();

    public function onOpen(ConnectionInterface $connection)
    {
        Log::debug("Opening websocket handler");
        $this
            ->verifyAppKey($connection)
            ->generateSocketId($connection);

        $userId = $this->getUserId($connection);
        $userName = $this->getUserName($connection);
        $connection->send("Hi, man! I will call you " . $userName);
        $this->userList[$userId] = $userName;
    }
    
    public function onClose(ConnectionInterface $connection)
    {
        $userId = QueryParameters::create($connection->httpRequest)->get('userId');
        $userName = $this->getUserName($connection);
        unset($this->userList[$userId]);
        Log::debug("Bye, " . $userName);
    }

    public function onError(ConnectionInterface $connection, \Exception $e)
    {
        Log::debug("Error on websocket: " . $e);
    }

    public function onMessage(ConnectionInterface $connection, MessageInterface $msg)
    {
        Log::debug("New message on webSocket: ". $msg->getPayload());
        Log::debug("Current users: ");
        foreach($this->userList as $userName ) {
            Log::debug($userName);
        }
         
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

    private function getUserName($connection) {
        $userId = $this->getUserId($connection);
        $userName = "Guest";
        $user = User::find($userId);
        if($user) {
            $userName = $user->name;
        }
        return $userName;
    }

    private function getUserId($connection) {
        return QueryParameters::create($connection->httpRequest)->get('userId');
    }
}