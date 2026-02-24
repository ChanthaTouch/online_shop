<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OrderRefunded extends Notification
{
    use Queueable;

    public $order;
    public $amount;

    public function __construct($order, $amount = null)
    {
        $this->order = $order;
        $this->amount = $amount;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'order_refunded',
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'amount' => $this->amount,
            'message' => "Order {$this->order->order_number} was refunded",
        ];
    }
}
