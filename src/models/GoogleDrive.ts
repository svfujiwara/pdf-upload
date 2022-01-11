const { PassThrough } = require('stream');
const request = require('request');
const { google } = require('googleapis');
const credentials = require('../../credentials.json');

const scopes = ['https://www.googleapis.com/auth/drive'];
const clientOptions = { subject: 'pdf-upload@pdf-upload-336505.iam.gserviceaccount.com'};

export class GoogleDrive {
    private drive: any;

    constructor() {
        this.drive = null;
    }

    async setup() {
        const auth = await google.auth.getClient({
            credentials: credentials,
            scopes: scopes,
            clientOptions: clientOptions
        });

        this.drive = google.drive({version: 'v3', auth});
    }

    /**
     * ファイルをGoogle Driveにアップロードする
     * 実際にはSlackからファイルをダウンロードしたのちDriveに作成をしている
     * @param fileUrl
     * @param fileName
     * @returns {Promise<void>}
     */
    async createFile(fileUrl: string, fileName: string) {
        try {
            const stream = request({
                url: fileUrl,
                method: 'GET',
                encoding: null,
                headers: {
                    'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });

            const pt = new PassThrough();
            stream.pipe(pt);

            await this.drive.files.create({
                requestBody: {
                    parents: [ process.env.GOOGLE_DRIVE_FOLDER_ID ],
                    mimeType: 'application/pdf',
                    name: fileName,
                },
                media: {
                    mimeType: 'application/pdf',
                    body: pt,
                },
                fields: 'id',
            });
        } catch (e) {
            console.error(e);
        }
    }
}
