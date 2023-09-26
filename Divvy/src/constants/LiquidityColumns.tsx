import React from "react";
export const LIQUIDITY_ACTIVITY_COLUMNS: any = [
    {
        title: 'Activity Type',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'User Pubkey',
        dataIndex: 'pubkey',
        key: 'pubkey',
        render: (html: any) => <div style={{ textAlign: "left" }} dangerouslySetInnerHTML={{__html: html}} />,
    },
    {
        title: 'Match',
        dataIndex: 'match',
        key: 'match',
        render: (html: any) => <div style={{ textAlign: "right" }} dangerouslySetInnerHTML={{ __html: html }} />,
    },
    {
        title: 'Odds',
        dataIndex: 'odds',
        key: 'odds',
        render: (html: any) => <div style={{ textAlign: "right" }} dangerouslySetInnerHTML={{ __html: html === 0 ? "-" : html }} />,
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (html: any) => <div style={{ textAlign: "right" }} dangerouslySetInnerHTML={{ __html: html }} />,
    },
]

export const LIQUIDITY_ACTIVITY_MOBILE_COLUMNS: any = [
  {
    render: (record: any) => (
        <React.Fragment >
          <div className="md-td">
            <div style={{display:'flex'}}>
              <div style={{width:'50%'}}>
                <div className="text-secondary">Activity Type:</div>
                <div dangerouslySetInnerHTML={{ __html: record.type }} />
              </div>
              <div style={{width:'50%'}}>
                <div className="text-secondary">Amount:</div>
                <div dangerouslySetInnerHTML={{ __html: record.amount }} />
              </div>
            </div>
            <div style={{display:'flex'}}>
              <div style={{width:'50%'}}>
                <div className="text-secondary">Match:</div>
                <div dangerouslySetInnerHTML={{ __html: record.match }} />
              </div>
              <div style={{width:'50%'}}>
                <div className="text-secondary">Odds:</div>
                <div dangerouslySetInnerHTML={{ __html: record.odds }} />
              </div>
            </div>
            <div>
              <div className="text-secondary">User Pubkey:</div>
              <div dangerouslySetInnerHTML={{ __html: record.pubkey }} />
            </div>
          </div>
        </React.Fragment>
      ),
  }
]