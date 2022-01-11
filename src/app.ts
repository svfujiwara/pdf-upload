import { App, AwsLambdaReceiver, SlackViewAction } from '@slack/bolt';
import dotenv from 'dotenv';
dotenv.config();

import formView from './views/PDFInfoForm';
import { GoogleDrive } from './models/GoogleDrive';

const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN || '',
    receiver: awsLambdaReceiver,
});

// Handle the Lambda function event
module.exports.handler = async (event: any, context: any, callback: any) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}

app.shortcut({ callback_id: 'pdf_upload', type: 'message_action'}, async ({shortcut, ack, context, payload, say, body}) => {
    try {
        await ack();

        if (payload.message.files == null) {
            await say({
                thread_ts: body.message_ts,
                text: `<@${body.user.id}>\nファイルが見つかりません。`,
            });
            console.log('添付ファイルのないメッセージでアクションが実行されました。')
        } else {
            const meta = {
                file: payload.message.files[0].url_private,
                thread_ts: body.message_ts,
                channel_id: body.channel.id,
            }

            await app.client.views.open({
                token: context.botToken,
                trigger_id: shortcut.trigger_id,
                view: {
                    type: 'modal',
                    callback_id: 'pdf_upload_submit',
                    private_metadata: JSON.stringify(meta),
                    ...formView
                },
            });
        }
    }
    catch (e) {
        console.error(e)
    }
});

app.view('pdf_upload_submit', async ({ ack, view, body}) => {
    try {
        await ack();

        const fileName = makeFileName(body);

        const meta = JSON.parse(view.private_metadata);
        const file = meta.file;
        const threadTs = meta.thread_ts;
        const channelId = meta.channel_id;

        const googleDrive = new GoogleDrive();
        await googleDrive.setup();
        await googleDrive.createFile(file, fileName);


        const result = await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN || '',
            channel: channelId,
            thread_ts: threadTs,
            text: `<@${body.user.id}>\nアップロードが完了しました。\n「${fileName}」`,
        })

        console.log('アップロードが完了しました。>> ' + result)

    } catch (e) {
        console.error(e);
    }
});


const makeFileName = (body: SlackViewAction) => {
    const v = body.view.state.values;
    const date = v.date.date_input?.selected_date?.replace(/-/g, '');
    const client = v.client.client_input?.value?.trim().replace(/[ 　]/g, '_');
    const amount = v.amount.amount_input?.value?.trim().replace(/[,¥円]/g, '');
    const project = v.project.project_input?.value?.trim().replace(/[ 　]/g, '_');
    const type = v.type.type_select?.selected_option?.value;

    return `${date}-${client}-${amount}-${project}-${type}.pdf`;
}