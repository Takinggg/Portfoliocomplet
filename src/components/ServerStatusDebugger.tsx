/**
 * Debugger complet pour tester le serveur Supabase
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function ServerStatusDebugger() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

  const addResult = (test: string, success: boolean, data: any) => {
    setResults(prev => [...prev, { test, success, data, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    // Test 1: Sans Authorization
    try {
      const res1 = await fetch(`${serverUrl}/health`);
      const text1 = await res1.text();
      let json1;
      try {
        json1 = JSON.parse(text1);
      } catch {
        json1 = text1;
      }
      addResult("Sans Authorization", res1.ok, { status: res1.status, body: json1 });
    } catch (error: any) {
      addResult("Sans Authorization", false, { error: error.message });
    }

    // Test 2: Avec Authorization (publicAnonKey)
    try {
      const res2 = await fetch(`${serverUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const text2 = await res2.text();
      let json2;
      try {
        json2 = JSON.parse(text2);
      } catch {
        json2 = text2;
      }
      addResult("Avec Authorization (publicAnonKey)", res2.ok, { status: res2.status, body: json2 });
    } catch (error: any) {
      addResult("Avec Authorization (publicAnonKey)", false, { error: error.message });
    }

    // Test 3: Test projects endpoint
    try {
      const res3 = await fetch(`${serverUrl}/projects`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const text3 = await res3.text();
      let json3;
      try {
        json3 = JSON.parse(text3);
      } catch {
        json3 = text3;
      }
      addResult("GET /projects", res3.ok, { status: res3.status, body: json3 });
    } catch (error: any) {
      addResult("GET /projects", false, { error: error.message });
    }

    // Test 4: Test newsletter stats
    try {
      const res4 = await fetch(`${serverUrl}/newsletter/stats`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const text4 = await res4.text();
      let json4;
      try {
        json4 = JSON.parse(text4);
      } catch {
        json4 = text4;
      }
      addResult("GET /newsletter/stats", res4.ok, { status: res4.status, body: json4 });
    } catch (error: any) {
      addResult("GET /newsletter/stats", false, { error: error.message });
    }

    setLoading(false);
  };

  const copyResults = () => {
    const text = JSON.stringify(results, null, 2);
    navigator.clipboard.writeText(text);
    alert("Résultats copiés !");
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🔍 Server Status Debugger</h2>
        <div className="flex gap-2">
          <Button onClick={runTests} disabled={loading}>
            {loading ? "Testing..." : "Run Tests"}
          </Button>
          {results.length > 0 && (
            <Button onClick={copyResults} variant="outline">
              Copy Results
            </Button>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>Server URL: <code className="bg-gray-100 px-2 py-1 rounded">{serverUrl}</code></p>
        <p>Project ID: <code className="bg-gray-100 px-2 py-1 rounded">{projectId}</code></p>
      </div>

      {results.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((result, i) => (
            <div
              key={i}
              className={`p-3 rounded border ${
                result.success 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {result.success ? "✅" : "❌"} {result.test}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-sm text-gray-600">Running tests...</p>
        </div>
      )}
    </Card>
  );
}
