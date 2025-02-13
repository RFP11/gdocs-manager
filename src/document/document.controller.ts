import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DocumentDto } from './dto';
import { DocumentService } from './document.service';

@UseGuards(JwtAuthGuard)
@Controller('document')
export class DocumentController {
    constructor(private documentService: DocumentService){}

    @Get('')
    async documents(@Request() req,  @Query('page') page: number = 1, @Query('limit') limit: number = 10){
       return this.documentService.getDocs(req.user.sub, page, limit)
    }

    @Get(':id')
    document(@Param('id') id, @Request() req){
        if (id != Number) id = Number(id)
        return this.documentService.getDoc(id, req.user.sub)
    }


    @Post('')
    addDocs(@Request() req,@Body() data:DocumentDto){
        return this.documentService.create(req.user.sub, data)
    }

    @Put(':id')
    editDocs(@Param('id') id, @Body() data:DocumentDto){
        if (id != Number) id = Number(id)
        return this.documentService.update(id, data)
    }

    @Delete(':id')
    deleteDocs(@Param('id') id){
        if (id != Number) id = Number(id)
        return this.documentService.delete(id)
    }

    @Put('restore/:id')
    undeleteDocs(@Param('id') id){
        if (id != Number) id = Number(id)
        return this.documentService.undelete(id)
    }

    
}
