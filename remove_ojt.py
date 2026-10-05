import io
import re

with io.open("src/pages/IndividualSkillMatrix.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Find the start of the table
start_str = "{/* OJT ASSESSMENT HISTORY LOG TABLE"
start_idx = text.find(start_str)

if start_idx != -1:
    # We want to keep the closing tags of the main container.
    # The file ends with:
    #     </div>
    #   );
    # }
    
    # We will slice off from start_idx up to the end minus the closing tags.
    # Let's find the last occurrences of `</div>` and `);` to be safe.
    
    end_tag = "    </div>\n  );\n}"
    end_idx = text.rfind(end_tag)
    
    if end_idx != -1:
        # Keep everything before start_idx and the end_tag
        new_text = text[:start_idx].rstrip() + "\n" + end_tag
        with io.open("src/pages/IndividualSkillMatrix.tsx", "w", encoding="utf-8") as f:
            f.write(new_text)
        print("Successfully removed OJT table.")
    else:
        print("Could not find end tags.")
else:
    print("Could not find start string.")

