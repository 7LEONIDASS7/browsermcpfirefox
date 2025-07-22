import { z } from 'zod';

export const NavigateTool = z.object({
  name: z.literal('navigate'),
  description: z.literal('Navigate to a URL'),
  arguments: z.object({
    url: z.string().describe('URL to navigate to')
  })
});

export const GoBackTool = z.object({
  name: z.literal('go_back'),
  description: z.literal('Go back in browser history'),
  arguments: z.object({})
});

export const GoForwardTool = z.object({
  name: z.literal('go_forward'),
  description: z.literal('Go forward in browser history'),
  arguments: z.object({})
});

export const WaitTool = z.object({
  name: z.literal('wait'),
  description: z.literal('Wait for a specified time'),
  arguments: z.object({
    time: z.number().describe('Time to wait in seconds')
  })
});

export const PressKeyTool = z.object({
  name: z.literal('press_key'),
  description: z.literal('Press a key'),
  arguments: z.object({
    key: z.string().describe('Key to press')
  })
});

export const ClickTool = z.object({
  name: z.literal('click'),
  description: z.literal('Click an element'),
  arguments: z.object({
    element: z.string().describe('Element to click')
  })
});

export const DragTool = z.object({
  name: z.literal('drag'),
  description: z.literal('Drag an element to another element'),
  arguments: z.object({
    startElement: z.string().describe('Element to drag from'),
    endElement: z.string().describe('Element to drag to')
  })
});

export const TypeTool = z.object({
  name: z.literal('type'),
  description: z.literal('Type text'),
  arguments: z.object({
    text: z.string().describe('Text to type'),
    element: z.string().describe('Element to type into')
  })
});

export const HoverTool = z.object({
  name: z.literal('hover'),
  description: z.literal('Hover over an element'),
  arguments: z.object({
    element: z.string().describe('Element to hover over')
  })
});

export const SelectOptionTool = z.object({
  name: z.literal('select_option'),
  description: z.literal('Select an option from a dropdown'),
  arguments: z.object({
    element: z.string().describe('Select element'),
    option: z.string().describe('Option to select')
  })
});

export const SnapshotTool = z.object({
  name: z.literal('snapshot'),
  description: z.literal('Take a snapshot of the page'),
  arguments: z.object({})
});

export const ScreenshotTool = z.object({
  name: z.literal('screenshot'),
  description: z.literal('Take a screenshot'),
  arguments: z.object({})
});

export const GetConsoleLogsTool = z.object({
  name: z.literal('get_console_logs'),
  description: z.literal('Get console logs'),
  arguments: z.object({})
});