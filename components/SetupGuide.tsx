'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula, docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const code = `<Script
  src="https://retriv.in/agent-widget.js"
  data-agent-id="111223334445555"
  data-api-key="rt_1234456789"
  data-name="example"
  async
/>`;

export default function SetupGuide() {
    const { systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
        <div className="py-5 rounded-lg max-w-2xl mt-3 shadow-none">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                To add <span className="text-blue-500 font-bold">Retriv</span> to your website, follow these steps:
            </h2>

            <ol className="space-y-4 text-gray-800 dark:text-gray-200">
                <li>
                    <p className="font-bold">1. Sign up and register your website</p>
                    <p>Provide your website URL where you want the agent to appear.</p>
                </li>

                <li>
                    <p className="font-bold">2. We auto-crawl and retrieve your content</p>
                    <p>Retriv will scan your docs, blogs, and help content automatically.</p>
                </li>

                <li>
                    <p className="font-bold">3. Add the script snippet to your site</p>
                    <p>
                        Insert this script anywhere in your frontend (e.g. inside <code>layout.tsx</code>):
                    </p>

                    <div className="mt-2 rounded-lg font-mono text-sm overflow-x-auto">
                        <div>
                            <SyntaxHighlighter
                                language="html"
                                style={systemTheme === 'dark' ? darcula : docco}
                                customStyle={{
                                    padding: '12px',
                                    fontSize: '15px',
                                    borderRadius: '12px',
                                }}
                                wrapLongLines={true}
                            >
                                {code}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </li>
            </ol>
        </div>
    );
}
