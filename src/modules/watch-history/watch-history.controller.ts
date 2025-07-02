import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequestWithUser } from '../profiles/profiles.controller';
import { CreateWatchHistoryDto, UpdateWatchHistoryDto } from './dto/dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRole } from 'src/core/types/userRole.type';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Watch History')
@Controller('watch-history')
export class WatchHistoryController {
    constructor(private readonly watchHistoryService:WatchHistoryService){}

    @Get()
    getALl(){
        return this.watchHistoryService.getAll()
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    createWatchHistory(@Request() req:RequestWithUser, @Body() payload: CreateWatchHistoryDto){
        return this.watchHistoryService.createWatchHistory(req.user.id, payload)
    }

    @Put(':history_id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    updateWatchHistory(@Param('history_id') history_id:string, @Body() payload: UpdateWatchHistoryDto){
        return this.watchHistoryService.updateWatchHistory(history_id,payload)
    }

    @Delete(':history_id')
    @ApiBearerAuth()
    @ApiOperation({summary:`${UserRole.ADMIN},${UserRole.SUPER_ADMIN}`})
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(UserRole.ADMIN,UserRole.SUPER_ADMIN)
    deleteWatchHistory(@Param('history_id') history_id:string){
        return this.watchHistoryService.deleteHistory(history_id)
    }
}
