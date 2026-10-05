import io

with io.open("src/pages/Training.tsx", "r", encoding="utf-8") as f:
    text = f.read()

filter_str = """  const pendingTableData = requests.filter(r => r.status === 'pending_request');"""
new_filter_str = """  // Force Staff to only see their own records
  const visibleRequests = isStaff ? requests.filter(r => r.employee === 'นายสมชาย ใจดี') : requests;

  const pendingTableData = visibleRequests.filter(r => r.status === 'pending_request');
  const rejectedTableData = visibleRequests.filter(r => r.status === 'rejected_request');
  const executionTableData = visibleRequests.filter(r => r.status === 'waiting_for_test' || r.status === 'pending_manager');
  const completedTableData = visibleRequests.filter(r => r.status === 'completed');"""

text = text.replace(filter_str, new_filter_str)

# Remove the old definitions
text = text.replace("  const rejectedTableData = requests.filter(r => r.status === 'rejected_request');\n", "")
text = text.replace("  const executionTableData = requests.filter(r => r.status === 'waiting_for_test' || r.status === 'pending_manager');\n", "")
text = text.replace("  const completedTableData = requests.filter(r => r.status === 'completed');\n", "")

with io.open("src/pages/Training.tsx", "w", encoding="utf-8") as f:
    f.write(text)
