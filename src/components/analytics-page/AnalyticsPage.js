import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {faDownload, faUser} from '@fortawesome/free-solid-svg-icons';
import AnalyticsCard from "./AnalyticsCard";
import AnalyticsTable from "./AnalyticsTable";
import {Loader} from "../../common";
import {Pie} from 'react-chartjs-2';
import {getDashboardData} from "../../api/api";
import {toastError} from "../../common/toast";
import DatePicker from "react-datepicker";
import moment from "moment";

const getOrCreateLegendList = (chart, id) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer.querySelector('ul');

    if (!listContainer) {
        listContainer = document.createElement('ul');
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'row';
        listContainer.style.margin = 0;
        listContainer.style.padding = 0;

        legendContainer.appendChild(listContainer);
    }

    return listContainer;
};

const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart) {
        const ul = getOrCreateLegendList(chart, chart.options.htmlLegend.containerID);

        ul.style.display = 'block'
        // Remove old legend items
        while (ul.firstChild) {
            ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        items.forEach(item => {
            const li = document.createElement('li');
            li.style.alignItems = 'center';
            li.style.cursor = 'pointer';
            li.style.display = 'flex';
            li.style.flexDirection = 'row';
            li.style.marginLeft = '10px';
            li.style.marginTop = '4px';

            li.onclick = () => {
                const {type} = chart.config;
                if (type==='pie' || type==='doughnut') {
                    // Pie and doughnut charts only have a single dataset and visibility is per item
                    chart.toggleDataVisibility(item.index);
                } else {
                    chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                }
                chart.update();
            };

            // Color box
            const boxSpan = document.createElement('span');
            boxSpan.style.background = item.fillStyle;
            boxSpan.style.borderColor = item.strokeStyle;
            boxSpan.style.borderWidth = item.lineWidth + 'px';
            boxSpan.style.display = 'inline-block';
            boxSpan.style.height = '14px';
            boxSpan.style.marginRight = '10px';
            boxSpan.style.width = '14px';

            // Text
            const textContainer = document.createElement('p');
            textContainer.style.color = item.fontColor;
            textContainer.style.margin = 0;
            textContainer.style.padding = 0;
            textContainer.style.maxWidth = '90%';
            textContainer.style.textDecoration = item.hidden ? 'line-through':'';

            const text = document.createTextNode(item.text);
            textContainer.appendChild(text);

            li.appendChild(boxSpan);
            li.appendChild(textContainer);
            ul.appendChild(li);
        });
    }
};

const FallBackComp = () => (
        <Loader loading={true} loadingText="Loading...">
            <div className="vh-100 w-100"></div>
        </Loader>
)


const CHART_COLORS = [
    'rgba(255, 23, 68, 0.8)',
    'rgba(255, 160, 0, 0.8)',
    'rgba(24, 255, 255, 0.8)',
    'rgba(191, 54, 12, 0.8)',
    'rgba(198, 255, 0, 0.8)',
    'rgba(233, 30, 99, 0.8)',
    'rgba(98, 0, 234, 0.8)',
    'rgba(245, 124, 0, 0.8)',
    'rgba(0, 230, 118, 0.8)',
    'rgba(244, 81, 30, 0.8)',
];


const AnalyticPage = () => {

    const getOrCreateTooltip = (chart) => {
        let tooltipEl = chart.canvas.parentNode.querySelector('div');

        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
            tooltipEl.style.borderRadius = '3px';
            tooltipEl.style.color = 'white';
            tooltipEl.style.opacity = 1;
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.transform = 'translate(-50%, 0)';
            tooltipEl.style.transition = 'all .1s ease';

            const table = document.createElement('table');
            table.style.margin = '0px';

            tooltipEl.appendChild(table);
            chart.canvas.parentNode.appendChild(tooltipEl);
        }

        return tooltipEl;
    };

    const externalTooltipHandler = (context) => {
        // Tooltip Element
        const {chart, tooltip} = context;
        const tooltipEl = getOrCreateTooltip(chart);

        // Hide if no tooltip
        if (tooltip.opacity===0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set Text
        if (tooltip.body) {
            const titleLines = tooltip.title || [];
            const bodyLines = tooltip.body.map(b => b.lines);

            const tableHead = document.createElement('thead');

            titleLines.forEach(title => {
                const tr = document.createElement('tr');
                tr.style.borderWidth = 0;

                const th = document.createElement('th');
                th.style.borderWidth = 0;
                const text = document.createTextNode(title);

                th.appendChild(text);
                tr.appendChild(th);
                tableHead.appendChild(tr);
            });

            const tableBody = document.createElement('tbody');
            bodyLines.forEach((body, i) => {
                const colors = tooltip.labelColors[i];

                const span = document.createElement('span');
                span.style.background = colors.backgroundColor;
                span.style.borderColor = colors.borderColor;
                span.style.borderWidth = '2px';
                span.style.marginRight = '10px';
                span.style.height = '10px';
                span.style.width = '10px';
                span.style.display = 'inline-block';

                const tr = document.createElement('tr');
                tr.style.backgroundColor = 'inherit';
                tr.style.borderWidth = 0;

                const td = document.createElement('td');
                td.style.borderWidth = 0;

                const text = document.createTextNode(body);

                td.appendChild(span);
                td.appendChild(text);
                tr.appendChild(td);
                tableBody.appendChild(tr);
            });

            const tableRoot = tooltipEl.querySelector('table');

            // Remove old children
            while (tableRoot.firstChild) {
                tableRoot.firstChild.remove();
            }

            // Add new children
            tableRoot.appendChild(tableHead);
            tableRoot.appendChild(tableBody);
        }

        const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
        tooltipEl.style.font = tooltip.options.bodyFont.string;
        tooltipEl.style.padding = '0px 8px';
    };

    const chartOptions = {
        maintainAspectRatio: false,
        layout: {
            padding: 0
        },
        htmlLegend: {
            containerID: 'legend-container',
        },
        plugins: {
            tooltip: {
                enabled: false,
                mode: 'nearest',
                external: externalTooltipHandler,
            },
            legend: {
                display: false,
                position: 'bottom',
                align: 'start',
                onHover: function () {
                    Array.from(document.getElementsByClassName("pie-chart"))?.forEach(e => {
                        e.style.cursor = 'pointer';
                    });
                },
                onLeave: function () {
                    Array.from(document.getElementsByClassName("pie-chart"))?.forEach(e => {
                        e.style.cursor = 'default';
                    });
                }
            },
        }
    };

    const regionChartOption = {
        ...chartOptions,
        htmlLegend: {
            containerID: 'legend-region-container',
        },
    };

    const [loading, setIsLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const getAnalyticsDataFromBackend = useCallback((reset = false) => {
        setIsLoading(true);
        let paramString = '';

        if (startDate && endDate) {
            const params = {
                startDate: startDate ? moment(startDate).format('YYYY-MM-DD'):undefined,
                endDate: endDate ? moment(endDate).format('YYYY-MM-DD'):undefined,
            };
            paramString = Object.entries(params)
                    .filter(arr => arr[1]!==undefined)
                    .map(([k, v]) => `${k}=${v}`)
                    .join('&');
        }

        if (reset) {
            paramString = ''
        }

        getDashboardData(paramString).then(data => {
            setAnalyticsData(data);
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false)
            toastError('Error during fetching analytics data.');
        });
    }, [startDate, endDate]);

    const resetFilter = useCallback(() => {
        setStartDate(null);
        setEndDate(null);
        getAnalyticsDataFromBackend(true);
    }, [getAnalyticsDataFromBackend]);

    const applyFilter = useCallback(() => {
        if (!startDate) {
            toastError('Please select start Date')
        } else if (!endDate) {
            toastError('Please select end Date')
        } else {
            getAnalyticsDataFromBackend();
        }
    }, [startDate, endDate, getAnalyticsDataFromBackend]);

    useEffect(() => {
        getAnalyticsDataFromBackend();
    }, []);

    const featureGroupingData = useMemo(() => ({
        headers: ['Feature', 'Export Count'],
        data: analyticsData?.download_data?.map(({title, count}) => [title, count]) ?? [],
    }), [analyticsData]);

    const regionGroupingData = useMemo(() => ({
        headers: ['Region', 'User Count'],
        data: analyticsData?.visitor_data?.map(({country, count}) => [country, count]) ?? [],
    }), [analyticsData]);

    const featureChartData = useMemo(() => ({
        labels: analyticsData?.download_data?.map(({title}) => title) ?? [],
        datasets: [
            {
                label: 'No. of count',
                data: analyticsData?.download_data?.map(({count}) => count) ?? [],
                backgroundColor: [
                    ...CHART_COLORS
                ],
                borderWidth: 1,
            },
        ],
    }), [analyticsData]);

    const regionChartData = useMemo(() => ({
        labels: analyticsData?.visitor_data?.map(({country}) => country) ?? [],
        datasets: [
            {
                label: 'No. of count',
                data: analyticsData?.visitor_data?.map(({count}) => count) ?? [],
                backgroundColor: [
                    ...CHART_COLORS
                ],
                borderWidth: 1,
            },
        ],
    }), [analyticsData]);

    if (loading) {
        return (<FallBackComp/>);
    }

    if (!analyticsData) {
        return null;
    }

    return (
            <div className="container-fluid">
                <div className="d-flex align-items-center justify-content-center ">
                    <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                </div>
                <div className="row d-md-flex justify-content-center justify-content-md-between justify-content-lg-start ml-lg-2">
                    <div className="row col-xl-3 col-lg-5 col-md-6 col-sm-12 d-flex align-items-center mt-3 mr-lg-5">
                        <span className="col-4 h6 pr-md-1 pr-0 pl-lg-0">Start Date</span>
                        <span className="col-8">
                        <DatePicker
                                onChange={(date) => setStartDate(date)}
                                selected={startDate}
                                maxDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/yyyy"
                        />
                        </span>
                    </div>
                    <div className="row col-xl-3 col-lg-5  mr-md-3 col-md-6 col-sm-12 d-flex align-items-center endDate mt-3 mr-lg-4">
                        <span className="col-4 h6 pr-md-1 pr-0 pl-lg-0">End Date</span>
                        <span className="col-8">
                        <DatePicker
                                onChange={(date) => setEndDate(date)}
                                selected={endDate}
                                maxDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/yyyy"
                        />
                    </span>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-sm-12 mr-md-0 ml-md-0 row d-flex justify-content-center justify-content-lg-start mt-4">
                        <button type="button" className="btn btn-light date-filter-button" onClick={resetFilter}>
                            Reset
                        </button>
                        <button type="button" className="btn btn-light" onClick={applyFilter}>
                            Apply
                        </button>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-xl-6 col-12">
                        <div className="row pt-xl-5 mt-xl-3">
                            <div className="col-md-6 col-sm-12 mb-4">
                                <AnalyticsCard title="No. of users accessing the site"
                                               count={analyticsData?.total_visitor_count}
                                               icon={faUser}/>
                            </div>
                            <div className="col-md-6 col-sm-12 mb-4">
                                <AnalyticsCard title="No. of downloads" count={analyticsData?.total_download_count}
                                               icon={faDownload}/>
                            </div>
                        </div>
                        <div className="row mt-lg-3 mt-4">
                            <div className="col-12 col-lg-12 mb-4 rounded text-center">
                                <div className="shadow p-4 analytics-card">
                                    <h5 className="h5 text-gray-800 mb-4">Feature wise export counts</h5>
                                    {
                                        analyticsData?.download_data?.length > 0 ? (
                                                        <div className='position-relative container-chart'>
                                                            <div className="canvas-cont">
                                                                <Pie key={'graph1'}
                                                                     className="pie-chart"
                                                                     data={featureChartData}
                                                                     plugins={[htmlLegendPlugin]}
                                                                     options={chartOptions}
                                                                />
                                                            </div>
                                                            <div className="legend-cont" id={"legend-container"}/>

                                                        </div>
                                                ):
                                                (
                                                        "No data available"
                                                )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row mt-lg-3 mt-4">
                            <div className="col-12 col-lg-12 mb-4 mt-md-0 mt-4 text-center">
                                <div className="shadow p-4 analytics-card">
                                    <h5 className="h5 text-gray-800 mb-4">Region wise user counts</h5>
                                    {
                                        analyticsData?.visitor_data?.length > 0 ? (
                                                        <div className='position-relative container-chart'>
                                                            <div className="canvas-cont">
                                                                <Pie key={'graph2'}
                                                                     className="pie-chart"
                                                                     data={regionChartData}
                                                                     plugins={[htmlLegendPlugin]}
                                                                     options={regionChartOption}/>
                                                            </div>
                                                            <div className="legend-cont" id={"legend-region-container"}/>
                                                        </div>
                                                ):
                                                (
                                                        "No data available"
                                                )
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="row mt-lg-3 mt-4 justify-content-center">
                            <div className="col-12 mb-4 text-center">
                                <h5 className="h5 text-gray-800 mb-4">Feature wise export counts</h5>
                                {
                                    analyticsData?.download_data?.length > 0 ? (
                                                    <AnalyticsTable headers={featureGroupingData.headers}
                                                                    rows={featureGroupingData.data}/>
                                            ):
                                            (
                                                    <div className="p-5 shadow">
                                                        No data available
                                                    </div>
                                            )
                                }
                            </div>
                        </div>
                        <div className="row mt-lg-3 mt-4 justify-content-center">
                            <div className="col-12 mb-4 mt-md-0 mt-4 text-center">
                                <h5 className="h5 text-gray-800 mb-4">Region wise user counts</h5>
                                {
                                    analyticsData?.visitor_data?.length > 0 ? (
                                                    <AnalyticsTable headers={regionGroupingData.headers}
                                                                    rows={regionGroupingData.data}/>
                                            ):
                                            (
                                                    <div className="p-5 shadow">
                                                        No data available
                                                    </div>
                                            )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default AnalyticPage;
