import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Player } from './interfaces/player.interface';
import { PlayerService } from './players.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class PlayersController {
  constructor(private readonly playerService: PlayerService) {}

  logger = new Logger(PlayersController.name);

  @EventPattern('create-player')
  async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
    console.log('createPlayuer');
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      this.logger.log(`player: ${JSON.stringify(player)}`);

      await this.playerService.createPlayer(player);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('consult-player')
  async consultPlayer(@Payload() _id: string, @Ctx() context: RmqContext) {
    console.log('cheguei aqui');
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      if (_id) {
        return await this.playerService.findPlayerFromId(_id);
      } else {
        return await this.playerService.findAllPlayers();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-player')
  async updatePlayer(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`data: ${JSON.stringify(data)}`);
    try {
      const _id: string = data.id;
      const player: Player = data.player;
      await this.playerService.updatePlayer(_id, player);
      await channel.ack(originalMessage);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }

  @EventPattern('delete-player')
  async deletePlayer(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.playerService.deletePlayer(_id);
      await channel.ack(originalMessage);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }
}
