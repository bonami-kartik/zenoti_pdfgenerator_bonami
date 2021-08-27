import React from 'react';

const AnalyticsTable = ({headers, rows}) => {
    return (
            <div className="table-responsive shadow">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        {headers.map(header => (
                                <th key={header} scope="col">{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(row =>
                            <tr key={row}>
                                {
                                    row.map((item, index) => {
                                        if (index===0) {
                                            return (<th key={item} scope="row">{item}</th>);
                                        }

                                        return (<th key={item} >{item}</th>);
                                    })
                                }
                            </tr>
                    )}
                    </tbody>
                </table>
            </div>
    );
}

export default AnalyticsTable;
