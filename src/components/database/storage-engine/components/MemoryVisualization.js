import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function MemoryVisualization({ memoryState }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!memoryState) return;

    const containerWidth = svgRef.current.parentElement.clientWidth;
    const width = containerWidth;
    const height = 300;
    const nodeWidth = 80;
    const nodeHeight = 40;
    const margin = { top: 20, right: 10, bottom: 20, left: 10 };

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tree = d3.tree()
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
      .nodeSize([nodeWidth * 1.2, nodeHeight * 1.5]);

    const root = d3.hierarchy(memoryState);
    const treeData = tree(root);

    const nodes = treeData.descendants();
    const links = treeData.links();

    const minX = d3.min(nodes, d => d.x);
    const maxX = d3.max(nodes, d => d.x);
    const minY = d3.min(nodes, d => d.y);
    const maxY = d3.max(nodes, d => d.y);

    const scale = Math.min(
      (width - margin.left - margin.right) / (maxX - minX + nodeWidth),
      (height - margin.top - margin.bottom) / (maxY - minY + nodeHeight)
    );

    const centerX = (minX + maxX) / 2;

    g.attr("transform", `translate(${(width - margin.left - margin.right) / 2 - centerX * scale + margin.left},${margin.top}) scale(${scale})`);

    g.selectAll(".link")
      .data(links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y))
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 0.5);

    const node = g.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x - nodeWidth / 2},${d.y - nodeHeight / 2})`);

    node.append("rect")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("fill", "white")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 0.5);

    node.each(function(d) {
      const nodeGroup = d3.select(this);
      const keys = d.data.keys || [];
      const values = d.data.values || [];

      keys.forEach((key, index) => {
        const value = values[index];
        const yOffset = (index - (keys.length - 1) / 2) * 12 + nodeHeight / 2;
        
        nodeGroup.append("text")
          .attr("x", nodeWidth / 2)
          .attr("y", yOffset)
          .attr("text-anchor", "middle")
          .attr("font-size", "8px")
          .text(`${truncateString(key, 4)}:${truncateString(value, 4)}`)
          .attr("fill", "black");
      });
    });

    node.append("text")
      .attr("x", nodeWidth / 2)
      .attr("y", -3)
      .attr("text-anchor", "middle")
      .text(d => d.data.isLeaf ? "L" : "I")
      .attr("font-size", "6px")
      .attr("fill", "#666");

  }, [memoryState]);

  function truncateString(str, num) {
    if (!str) return '';
    return str.length <= num ? str : str.slice(0, num) + '..';
  }

  return (
    <div className="memory-visualization">
      <h2 className="text-xl font-bold mb-2">B-Tree Visualization</h2>
      <div className="w-full overflow-x-auto border border-gray-300 rounded">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default MemoryVisualization;