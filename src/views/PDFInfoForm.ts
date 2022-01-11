const d = new Date();
const initDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;

export default {
    title: {
        type: 'plain_text' as 'plain_text',
        text: '書類保管ツール'
    },
    submit: {
        type: 'plain_text' as 'plain_text',
        text: 'アップロード',
    },
    blocks: [
        {
            type: 'input',
            block_id: 'date',
            label: {
                type: 'plain_text' as 'plain_text',
                text: '日付（請求日・発行日等）*'
            },
            element: {
                type: 'datepicker',
                action_id: 'date_input',
                initial_date: initDate,
            }
        },
        {
            type: 'input',
            block_id: 'client',
            label: {
                type: 'plain_text' as 'plain_text',
                text: '取引先名*'
            },
            element: {
                type: 'plain_text_input',
                action_id: 'client_input',
                placeholder: {
                    type: 'plain_text' as 'plain_text',
                    text: '株式会社抜きの企業名',
                }
            }
        },
        {
            type: 'input',
            block_id: 'amount',
            label: {
                type: 'plain_text' as 'plain_text',
                text: '金額（税込み）*'
            },
            element: {
                type: 'plain_text_input',
                action_id: 'amount_input',
                placeholder: {
                    type: 'plain_text',
                    text: '「,」や「円」の有無は問わない',
                }
            }
        },
        {
            type: 'input',
            block_id: 'project',
            label: {
                type: 'plain_text' as 'plain_text',
                text: '案件名*'
            },
            element: {
                type: 'plain_text_input',
                action_id: 'project_input',
                placeholder: {
                    type: 'plain_text',
                    text: '書面に記載されている案件名',
                }
            }
        },
        {
            type: "input",
            block_id: 'type',
            label: {
                type: "plain_text" as 'plain_text',
                text: "書類名*",
            },
            element: {
                type: "static_select",
                action_id: "type_select",
                placeholder: {
                    type: "plain_text" as 'plain_text',
                    text: "請求書、発注書など書類の種類",
                },
                options: [
                    {
                        text: {
                            type: "plain_text" as 'plain_text',
                            text: "請求書",
                        },
                        value: "請求書"
                    },
                    {
                        text: {
                            type: "plain_text" as 'plain_text',
                            text: "発注書",
                        },
                        value: "発注書"
                    },
                    {
                        text: {
                            type: "plain_text" as 'plain_text',
                            text: "見積書",
                        },
                        value: "見積書"
                    },
                    {
                        text: {
                            type: "plain_text" as 'plain_text',
                            text: "領収書",
                        },
                        value: "領収書"
                    },
                    {
                        text: {
                            type: "plain_text" as 'plain_text',
                            text: "発注請書",
                        },
                        value: "発注請書",
                    },
                    {
                        text: {
                            type: "plain_text" as 'plain_text',
                            text: "納品書",
                        },
                        value: "納品書",
                    },
                    {
                        text: {
                            type: "plain_text" as 'plain_text',
                            text: "申込書",
                        },
                        value: "申込書",
                    },
                ]
            }
        },
    ],
}
