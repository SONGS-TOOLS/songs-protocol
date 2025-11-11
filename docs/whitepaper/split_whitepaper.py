#!/usr/bin/env python3
"""
Script to split the MUSIC-INFRASTRUCTURE-WHITEPAPER.md into separate section files
"""

import re
import os

# Section mappings: (line_start, line_end, filename, title)
sections = [
    (7, 13, "01-ABSTRACT.md", "Abstract"),
    (15, 60, "02-EXECUTIVE-SUMMARY.md", "Executive Summary"),
    (62, 207, "03-INTRODUCTION.md", "Introduction"),
    (208, 580, "04-CURRENT-STATE-ANALYSIS.md", "Current State Analysis"),
    (581, 651, "05-TECHNICAL-REQUIREMENTS.md", "Technical Requirements"),
    (652, 1183, "06-PROPOSED-ARCHITECTURE.md", "Proposed Architecture"),
    (1184, 1231, "07-INTEGRATION.md", "Integration with Existing Infrastructure"),
    (1232, 1299, "08-ECONOMIC-MODEL.md", "Economic Model"),
    (1300, 1347, "09-NETWORK-EFFECTS.md", "Network Effects and Adoption"),
    (1348, 1400, "10-TECHNICAL-CHALLENGES.md", "Technical Challenges and Limitations"),
    (1401, 1458, "11-COMPARISON.md", "Comparison to Alternative Approaches"),
    (1459, 1584, "12-FUTURE-IMPLICATIONS.md", "Future Implications"),
    (1585, 1652, "13-IMPLEMENTATION-ROADMAP.md", "Implementation Roadmap"),
    (1653, 1707, "14-RISK-ANALYSIS.md", "Risk Analysis"),
    (1708, 1744, "15-CONCLUSION.md", "Conclusion"),
    (1745, 1902, "16-EXECUTIVE-ROADMAP.md", "Executive Summary & Implementation Roadmap"),
    (1903, 1926, "17-REFERENCES.md", "References"),
    (1927, 2035, "18-APPENDICES.md", "Appendices"),
]

def read_file_lines(filepath):
    """Read file and return lines as list"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.readlines()

def extract_section(lines, start_line, end_line):
    """Extract section from lines (1-indexed)"""
    return lines[start_line-1:end_line]

def add_header_and_navigation(content, filename, title, all_sections, is_first=False):
    """Add header and navigation links to section"""
    # Add document title header only for Abstract
    header = ""
    if filename == "01-ABSTRACT.md":
        header = "# Permanent Digital Music Infrastructure: A Technical and Economic Analysis\n\n"
        header += "**Working Draft v1.1 - Updated with Live Protocol Data**\n\n"
        header += "---\n\n"
    
    # Clean up duplicate separators - remove multiple consecutive separators
    content = re.sub(r'(\n---+\n\s*)+\n', '\n---\n\n', content)
    # Remove separator at the end before navigation
    content = re.sub(r'\n---+\n\s*$', '\n', content, flags=re.MULTILINE)
    
    # Add navigation
    nav_lines = []
    nav_lines.append("\n---\n\n")
    nav_lines.append("## Navigation\n\n")
    
    # Find current index
    current_idx = None
    for i, (_, _, fname, _) in enumerate(all_sections):
        if fname == filename:
            current_idx = i
            break
    
    if current_idx is not None:
        # Previous link
        if current_idx > 0:
            prev_file, prev_title = all_sections[current_idx - 1][2], all_sections[current_idx - 1][3]
            nav_lines.append(f"- [← Previous: {prev_title}]({prev_file})\n")
        
        # Next link
        if current_idx < len(all_sections) - 1:
            next_file, next_title = all_sections[current_idx + 1][2], all_sections[current_idx + 1][3]
            nav_lines.append(f"- [Next: {next_title} →]({next_file})\n")
        
        # Index link
        nav_lines.append(f"- [↑ Index](INDEX.md)\n")
        nav_lines.append(f"- [Full Document](../MUSIC-INFRASTRUCTURE-WHITEPAPER.md)\n")
    
    return header + content + "".join(nav_lines)

def main():
    input_file = "../MUSIC-INFRASTRUCTURE-WHITEPAPER.md"
    output_dir = "."
    
    # Read input file
    lines = read_file_lines(input_file)
    total_lines = len(lines)
    
    print(f"Total lines in file: {total_lines}")
    
    # Create each section file
    for start, end, filename, title in sections:
        # Adjust end if it exceeds file length
        end = min(end, total_lines)
        
        # Extract section
        section_lines = extract_section(lines, start, end)
        content = "".join(section_lines)
        
        # Add header and navigation (add header for abstract and executive summary)
        is_first = (filename == "01-ABSTRACT.md")
        content = add_header_and_navigation(content, filename, title, sections, is_first)
        
        # Write file
        output_path = os.path.join(output_dir, filename)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Created {filename} (lines {start}-{end})")
    
    print("\nDone! All sections created.")

if __name__ == "__main__":
    main()
