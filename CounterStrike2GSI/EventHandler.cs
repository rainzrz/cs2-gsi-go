﻿using CounterStrike2GSI.EventMessages;

namespace CounterStrike2GSI
{
    public class EventHandler<T> where T : BaseEvent
    {
        protected EventDispatcher<T> dispatcher = new EventDispatcher<T>();

        public EventHandler(ref EventDispatcher<T> EventDispatcher)
        {
            dispatcher = EventDispatcher;
        }
    }
}
