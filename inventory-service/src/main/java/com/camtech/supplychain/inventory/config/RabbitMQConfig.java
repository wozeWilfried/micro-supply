package com.camtech.supplychain.inventory.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${app.rabbitmq.exchange}")
    private String exchangeName;

    @Value("${app.rabbitmq.routing-key.stock-alert}")
    private String stockAlertRoutingKey;

    @Value("${app.rabbitmq.queue.stock-alert}")
    private String stockAlertQueue;

    /** Queue durable */
    @Bean
    public Queue stockAlertQueue() {
        return QueueBuilder.durable(stockAlertQueue).build();
    }

    /** Topic Exchange */
    @Bean
    public TopicExchange supplyChainExchange() {
        return new TopicExchange(exchangeName);
    }

    /** Liaison queue ↔ exchange */
    @Bean
    public Binding stockAlertBinding(Queue stockAlertQueue, TopicExchange supplyChainExchange) {
        return BindingBuilder
            .bind(stockAlertQueue)
            .to(supplyChainExchange)
            .with(stockAlertRoutingKey);
    }

    /** Convertir les messages en JSON */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    /** Injecter le convertisseur JSON dans le RabbitTemplate */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
