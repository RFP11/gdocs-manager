import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DocumentDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentService {
    constructor(private prisma:PrismaService){}

    async getDocs(userId:number, page: number = 1, limit: number = 10){
        const skip = (page - 1) * Number(limit)
        try {
            const [data, total] = await this.prisma.$transaction([
                this.prisma.document.findMany({
                    where: {
                        userId,
                        isDeleted: false
                    },
                    select: {
                        id: true,
                        title: true,
                        url: true,
                    },
                    skip,
                    take: Number(limit)
                }),
                this.prisma.document.count({
                    where: {
                        userId,
                        isDeleted:false
                    }
                })
            ])

            const totalPages = Math.ceil(total / limit)

            if (data.length == 0) return {
                data: [],
                message: "No data",
                total: 0,
                status: HttpStatus.OK,
                pagination: {
                    currentPage: page,
                    totalPages
                }
            }
            return {
                data,
                message: "Success",
                total,
                status: HttpStatus.OK,
                pagination: {
                    currentPage: page,
                    totalPages
                }
            }

        } catch (error) {
            console.log(error)
            throw new ForbiddenException('Something went wrong')
        }
    }

    async getDoc(documentId:number, userId:number){
        const data = await this.prisma.document.findUnique({
            where: {
                id: Number(documentId),
                userId,
                isDeleted: false
            },
            select: {
                id: true,
                title: true,
                url: true,
            }
        })

        if (!data) throw new HttpException('Data Not Found', HttpStatus.NOT_FOUND)

        return {
            data,
            total: 1,
            message: "Success",
            status: HttpStatus.OK
        }
    }

    async create(userId:number, data:DocumentDto){
        try {
            const item = await this.prisma.document.create({
                data: {
                    title: data.title,
                    userId: userId,
                    url: data.url
                }
            })

            return {
                'data' : 1,
                'message' : 'Success',
                status: HttpStatus.CREATED
            }
        } catch (error) {
            throw new ForbiddenException('Something went wrong')
        }
    }

    update(userId:Number, data:DocumentDto){}

    async delete(documentId:number){
        const id = Number(documentId)
        try{
            const data = await this.prisma.document.update({
                where: {id},
                data: {
                    isDeleted: true,
                    deletedAt: new Date()
                },
                select: {
                    id: true,
                    isDeleted: true
                }
            })

            return {
                data,
                message: "Success",
                status: HttpStatus.OK,
            }
        }catch(error){
            console.log(error)
            throw new HttpException('Something Wrong', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
