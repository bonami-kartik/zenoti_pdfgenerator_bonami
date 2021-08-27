import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const AnalyticsCard = ({title, count, icon}) => {
    return (
            <div className="card py-2 border-0 analytics-card">
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className="text-sm font-weight-bold text-uppercase mb-1 title">
                                {title}
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800 count">{count}</div>
                        </div>
                        <div className="col-auto">
                            <FontAwesomeIcon
                                    icon={icon}
                                    size="5x"
                                    className="ml-1 analytics-icon-color"
                                    title="No. of users accessing the site"
                            />
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default AnalyticsCard;
