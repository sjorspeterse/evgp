<?php

namespace App\WebSockets;

use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;
use Illuminate\Support\Facades\Log;

use BeyondCode\LaravelWebSockets\Apps\App;
use BeyondCode\LaravelWebSockets\QueryParameters;
use BeyondCode\LaravelWebSockets\WebSockets\Exceptions\UnknownAppKey;

use App\Models\User;
use Illuminate\Support\Facades\Cache;

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
        $userFullName = $this->getUserFullName($connection);
        $username = $this->getUserName($connection);
        $carNr = $this->getUserCarNr($connection);
        $connection->send("Welcome, " . $userFullName);
        $this->userList[$userId] = array("id" => $userId, "username" => $username, "fullName" => $userFullName, "carNr" => $carNr);
        $this->storeUsersToCache();
    }
    
    public function onClose(ConnectionInterface $connection)
    {
        $userId = QueryParameters::create($connection->httpRequest)->get('userId');
        $userName = $this->getUserFullName($connection);
        unset($this->userList[$userId]);
        Log::debug("Bye, " . $userName);
        $this->storeUsersToCache();
    }

    public function onError(ConnectionInterface $connection, \Exception $e)
    {
        Log::debug("Error on websocket: " . $e);
    }

    public function onMessage(ConnectionInterface $connection, MessageInterface $msg)
    {
        $payload = $msg->getPayload();
        $username = $this->getUserName($connection);
        $this->storePhysicsToCache($username, $payload);

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

    private function getUserFullName($connection) {
        $userId = $this->getUserId($connection);
        $userName = "Guest";
        $user = User::find($userId);
        if($user) {
            $userName = $user->name;
        }
        return $userName;
    }

    private function getUserCarNr($connection) {
        $userId = $this->getUserId($connection);
        $carNr = "00";
        $user = User::find($userId);
        if($user) {
            $carNr = $user->car_number;
        }
        return $carNr;
    }

    private function getUserName($connection) {
        $userId = $this->getUserId($connection);
        $userName = "Guest";
        $user = User::find($userId);
        if($user) {
            $userName = $user->username;
        }
        return $userName;
    }

    private function getUserId($connection) {
        return QueryParameters::create($connection->httpRequest)->get('userId');
    }

    public function storeUsersToCache() {
        $key = "user_list";
        $value = json_encode($this->userList);
        // Log::debug("Storing: " . $value . " at key " . $key);
        $invalidation_time = 7200;
        Cache::put($key, $value, $invalidation_time);
    }

    public function storePhysicsToCache($username, $physics) {
        $key = $username;
        $value = $physics;
        // Log::debug("Storing: " . $value . " at key " . $key);
        // $invalidation_time = 10;
        // Cache::put($key, $value, $invalidation_time);

        // store indefinitely
        Cache::put($key, $value);
    }
}