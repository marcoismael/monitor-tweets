import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { TweetsService } from '../tweets.service'
import { Interval } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CheckNewTweetsTask {
    private limit: number = 10

    constructor(
        private TweetService: TweetsService,
        @Inject(CACHE_MANAGER)
        private cache: Cache,
        @InjectQueue('emails')
        private emailsQueue: Queue
    ) { }

    @Interval(10000)
    async handle(): Promise<void> {
        let offset = await this.cache.get<number>('tweet-offset')
        offset = offset === undefined || offset === null ? 0 : offset
        console.log(`offeset ${offset}`)
        console.log('Check new Tweets . . . ')

        const tweets = await this.TweetService.findAll({
            offset,
            limit: this.limit
        })
        console.log(`Tweets count: ${tweets.length}`)
        if (tweets.length === this.limit) {
            console.log('Found more Tweets . . .')
            await this.cache.set('tweet-offset', offset + this.limit, {
                ttl: 1 * 60 * 10,
            })
            this.emailsQueue.add({})
        }
    }

}
