import { Job } from "bull";
import {Process, Processor} from '@nestjs/bull'
import { MailListService } from "./mail-list.service";

@Processor('emails')

export class SendMailTweetsJob {

    constructor(
        private mailListService: MailListService
    ) {}

    @Process()
    async handle(job: Job): Promise<void>{
        const mailList = await this.mailListService.findOne()
        console.log(mailList.emails)
        console.log('Kafka para enviar mensagem front')
    }
}