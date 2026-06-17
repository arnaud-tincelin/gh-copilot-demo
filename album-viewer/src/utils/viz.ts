// generate a plot with D3.js of the selling price of the album by year
// x-axis are the month series and y-axis show the numbers of albums sold
// data from the sales of album are loaded in from an external source and are in json format
import d3 from "d3";

type AlbumSalesInput = {
    date: string;
    sales: number | string;
};

type AlbumSalesPoint = {
    date: Date;
    sales: number;
};

export function generateAlbumSalesPlot(data: AlbumSalesInput[]) {
    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 40, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#album-sales-plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the date / time
    const parseDate = d3.timeParse("%Y-%m");

    // Format incoming data and drop records with invalid dates.
    const formattedData: AlbumSalesPoint[] = data
        .map((d) => ({
            date: parseDate(d.date),
            sales: Number(d.sales)
        }))
        .filter((d): d is AlbumSalesPoint => d.date !== null);

    if (formattedData.length === 0) {
        return;
    }

    // Set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define the line
    const valueline = d3.line<AlbumSalesPoint>()
        .x(d => x(d.date))
        .y(d => y(d.sales));

    // Scale the range of the data
    x.domain(d3.extent(formattedData, d => d.date) as [Date, Date]);
    y.domain([0, d3.max(formattedData, d => d.sales) ?? 0]);

    // Add the valueline path.
    svg.append("path")
        .data([formattedData])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}
