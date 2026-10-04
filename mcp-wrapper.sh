#!/bin/bash
echo "Wrapper started at $(date)" >> /tmp/mcp-wrapper.log
echo "Args: $@" >> /tmp/mcp-wrapper.log
echo "PWD: $(pwd)" >> /tmp/mcp-wrapper.log
echo "ENV: HOME=$HOME" >> /tmp/mcp-wrapper.log
exec /Users/yoga/.local/bin/codebase-memory-mcp "$@" 2>>/tmp/mcp-wrapper.log