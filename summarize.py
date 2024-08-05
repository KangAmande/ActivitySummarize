import json
import os

# File paths
vscode_acitivity_file = 'vscode/vscode_activities.json'
summary_file = 'activity_summary.txt'

# Function to read activities from a file
def read_activities(file_path):
    activities = []
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            for line in f:
                activities.append(json.loads(line.strip()))
            print("Activities read successfully")
    return activities

# Function to Generate user friendly summaries
def generate_summaries(activities):
    summaries = []
    for activity in activities:
        if activity['type'] == 'edit':
            summaries.append(f"Edited {activity['file']} at {activity['timestamp']}")
        elif activity['type'] == 'command':
            summaries.append(f"Ran command {activity['command']} at {activity['timestamp']}")
        elif activity['type'] == 'activeEditorChange':
            summaries.append(f"Switched to {activity['file']} at {activity['timestamp']}")
    print("Summaries generated successfully")
    return summaries

# Function to Write summaries to a file
def write_summaries_to_file(summaries):
    with open(summary_file, 'w') as file:
        for summary in summaries:
            file.write(f"{summary}\n")
        print("Summaries written to file successfully")

# Read activities from file
vscode_activities = read_activities(vscode_acitivity_file)

# Generate the summaries
summaries = generate_summaries(vscode_activities)

# Write summaries to a file
write_summaries_to_file(summaries)

print(f"Summaries written to {summary_file}")
