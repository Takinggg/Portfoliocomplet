// Resources routes module for the server
// This file contains all routes related to the resources (gated content) functionality

import { resourcesHTML } from "./resourcesHTML.tsx";

// Route to serve static HTML resources
export function setupResourcesRoutes(app: any, kv: any, supabase: any, requireAuth: any) {
  
  // Serve HTML resource files
  app.get("/make-server-04919ac5/resources/files/:filename", async (c: any) => {
    try {
      const filename = c.req.param("filename");
      
      // Get HTML content from the resourcesHTML object
      const htmlContent = resourcesHTML[filename];
      
      if (!htmlContent) {
        console.error(`Resource not found: ${filename}`);
        return c.html("<h1>Resource not found</h1><p>The requested resource does not exist.</p>", 404);
      }
      
      console.log(`📄 Serving resource: ${filename}`);
      
      // Return HTML content with proper headers
      return new Response(htmlContent, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=3600"
        }
      });
    } catch (error: any) {
      console.error("Error serving HTML resource:", error);
      return c.html("<h1>Error loading resource</h1>", 500);
    }
  });
  
  // Get all resources (public endpoint for listing)
  app.get("/make-server-04919ac5/resources", async (c: any) => {
    try {
      const lang = c.req.query("lang") || "fr"; // Default to French
      console.log(`📚 [PUBLIC] Fetching public resources (lang: ${lang})...`);
      
      let allResources = [];
      try {
        allResources = await kv.getByPrefix("resource:");
        console.log(`📦 [PUBLIC] KV returned ${allResources?.length || 0} resources`);
      } catch (kvError: any) {
        console.error("❌ [PUBLIC] KV getByPrefix error:", kvError);
        return c.json({ success: true, resources: [], message: "No resources found" });
      }
      
      // Handle case where no resources exist
      if (!allResources || allResources.length === 0) {
        console.log("📭 [PUBLIC] No resources found in database");
        return c.json({ success: true, resources: [], message: "No resources available yet" });
      }
      
      // Debug: Log each resource's isPublished status
      console.log("🔍 [PUBLIC] Checking resources...");
      allResources.forEach((r: any, idx: number) => {
        console.log(`  ${idx + 1}. ${r?.title_fr || r?.title || 'No title'} - isPublished: ${r?.isPublished} (type: ${typeof r?.isPublished})`);
      });
      
      // Filter only published resources for public access
      const publicResources = allResources
        .filter((r: any) => {
          const isValid = r && r.isPublished === true;
          if (!isValid) {
            console.log(`  ⚠️ Filtered out: ${r?.title_fr || r?.title} (isPublished: ${r?.isPublished})`);
          }
          return isValid;
        })
        .map((r: any) => {
          // Map language-specific fields based on lang parameter
          // If lang=en and no English content, fallback to French
          const title = lang === "en" && r.title_en ? r.title_en : (r.title_fr || r.title);
          const description = lang === "en" && r.description_en ? r.description_en : (r.description_fr || r.description);
          const fileUrl = lang === "en" && r.fileUrl_en ? r.fileUrl_en : (r.fileUrl_fr || r.fileUrl);
          
          return {
            ...r,
            title,
            description,
            fileUrl,
            // Keep original multilingual fields for reference
            title_fr: r.title_fr || r.title,
            title_en: r.title_en,
            description_fr: r.description_fr || r.description,
            description_en: r.description_en,
            fileUrl_fr: r.fileUrl_fr || r.fileUrl,
            fileUrl_en: r.fileUrl_en
          };
        })
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log(`✅ [PUBLIC] Returning ${publicResources.length} published resources (out of ${allResources.length} total)`);
      return c.json({ success: true, resources: publicResources });
    } catch (error: any) {
      console.error("❌ [PUBLIC] Error fetching resources:", error);
      return c.json({ success: false, error: error.message || "Unknown error" }, 500);
    }
  });

  // Get all resources (admin - includes unpublished)
  app.get("/make-server-04919ac5/resources/admin", requireAuth, async (c: any) => {
    try {
      console.log("📚 Admin fetching resources...");
      
      let allResources = [];
      try {
        allResources = await kv.getByPrefix("resource:");
      } catch (kvError: any) {
        console.error("KV getByPrefix error:", kvError);
        return c.json({ success: true, resources: [], message: "No resources found" });
      }
      
      if (!allResources || allResources.length === 0) {
        console.log("📭 No resources found in database");
        return c.json({ success: true, resources: [], message: "No resources available yet" });
      }
      
      const sorted = allResources.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      console.log(`📚 Admin fetched ${sorted.length} resources`);
      return c.json({ success: true, resources: sorted });
    } catch (error: any) {
      console.error("❌ Error fetching admin resources:", error);
      return c.json({ success: false, error: error.message || "Unknown error" }, 500);
    }
  });

  // Create resource (admin only)
  app.post("/make-server-04919ac5/resources", requireAuth, async (c: any) => {
    try {
      const body = await c.req.json();
      const { 
        title_fr, title_en, 
        description_fr, description_en,
        fileUrl_fr, fileUrl_en,
        category, coverImage, tags, isPublished,
        // Legacy fields for backward compatibility
        title, description, fileUrl
      } = body;

      // Use new multilingual fields, or fallback to legacy
      const titleFr = title_fr || title;
      const descFr = description_fr || description;
      const fileFr = fileUrl_fr || fileUrl;

      if (!titleFr || !descFr || !category || !fileFr) {
        return c.json({ 
          success: false, 
          error: "Title (FR), description (FR), category, and file URL (FR) are required" 
        }, 400);
      }

      const resourceId = `resource:${Date.now()}-${crypto.randomUUID()}`;
      const resource = {
        id: resourceId,
        // Multilingual fields
        title_fr: titleFr,
        title_en: title_en || "",
        description_fr: descFr,
        description_en: description_en || "",
        fileUrl_fr: fileFr,
        fileUrl_en: fileUrl_en || "",
        // Legacy fields for backward compatibility
        title: titleFr,
        description: descFr,
        fileUrl: fileFr,
        // Common fields
        category, // templates, guides, checklists, tools
        coverImage: coverImage || null,
        tags: tags || [],
        isPublished: isPublished ?? true,
        downloads: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await kv.set(resourceId, resource);
      
      console.log(`✅ Resource created: ${titleFr} (${category})`);
      return c.json({ success: true, resource });
    } catch (error: any) {
      console.error("Error creating resource:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // Update resource (admin only)
  app.put("/make-server-04919ac5/resources/:id", requireAuth, async (c: any) => {
    try {
      const resourceId = c.req.param("id");
      const body = await c.req.json();

      const existingResource = await kv.get(resourceId);
      if (!existingResource) {
        return c.json({ success: false, error: "Resource not found" }, 404);
      }

      const updatedResource = {
        ...existingResource,
        ...body,
        id: resourceId,
        // Update legacy fields from multilingual fields
        title: body.title_fr || existingResource.title_fr || existingResource.title,
        description: body.description_fr || existingResource.description_fr || existingResource.description,
        fileUrl: body.fileUrl_fr || existingResource.fileUrl_fr || existingResource.fileUrl,
        downloads: existingResource.downloads,
        createdAt: existingResource.createdAt,
        updatedAt: new Date().toISOString()
      };

      await kv.set(resourceId, updatedResource);
      
      console.log(`✅ Resource updated: ${updatedResource.title_fr || updatedResource.title}`);
      return c.json({ success: true, resource: updatedResource });
    } catch (error: any) {
      console.error("Error updating resource:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // Delete resource (admin only)
  app.delete("/make-server-04919ac5/resources/:id", requireAuth, async (c: any) => {
    try {
      const resourceId = c.req.param("id");
      
      const resource = await kv.get(resourceId);
      if (!resource) {
        return c.json({ success: false, error: "Resource not found" }, 404);
      }

      await kv.del(resourceId);
      
      console.log(`✅ Resource deleted: ${resource.title}`);
      return c.json({ success: true, message: "Resource deleted" });
    } catch (error: any) {
      console.error("Error deleting resource:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // Track resource download (gated content - requires email)
  app.post("/make-server-04919ac5/resources/:id/download", async (c: any) => {
    try {
      const resourceId = c.req.param("id");
      const body = await c.req.json();
      const { email, name, lang } = body; // Add lang parameter

      if (!email) {
        return c.json({ 
          success: false, 
          error: "Email is required to download resource" 
        }, 400);
      }

      const resource = await kv.get(resourceId);
      if (!resource) {
        return c.json({ success: false, error: "Resource not found" }, 404);
      }

      // Determine which file URL to use based on language
      const selectedLang = lang || "fr";
      const fileUrl = selectedLang === "en" && resource.fileUrl_en 
        ? resource.fileUrl_en 
        : (resource.fileUrl_fr || resource.fileUrl);

      // Track download in analytics
      const downloadId = `download:${resourceId}:${Date.now()}`;
      await kv.set(downloadId, {
        id: downloadId,
        resourceId,
        resourceTitle: resource.title,
        email,
        name: name || "Anonymous",
        timestamp: new Date().toISOString()
      });

      // Increment download counter
      const updatedResource = {
        ...resource,
        downloads: (resource.downloads || 0) + 1,
        updatedAt: new Date().toISOString()
      };
      await kv.set(resourceId, updatedResource);

      // Create or update lead from download
      const leadKey = `lead:${email}`;
      const existingLead = await kv.get(leadKey);
      
      if (!existingLead) {
        const newLead = {
          id: leadKey,
          name: name || email.split('@')[0],
          email,
          source: `Resource Download: ${resource.title}`,
          status: "new",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          notes: `Downloaded resource: ${resource.title} (${resource.category})`
        };
        await kv.set(leadKey, newLead);
        console.log(`✅ New lead created from resource download: ${email}`);
      } else {
        const updatedLead = {
          ...existingLead,
          notes: existingLead.notes 
            ? `${existingLead.notes}\n\nDownloaded: ${resource.title} (${new Date().toLocaleDateString()})`
            : `Downloaded: ${resource.title} (${new Date().toLocaleDateString()})`,
          updatedAt: new Date().toISOString()
        };
        await kv.set(leadKey, updatedLead);
        console.log(`✅ Lead updated with resource download: ${email}`);
      }

      console.log(`📥 Resource downloaded: ${resource.title} (lang: ${selectedLang}) by ${email}`);
      
      return c.json({ 
        success: true, 
        fileUrl: fileUrl,
        message: "Download tracked successfully" 
      });
    } catch (error: any) {
      console.error("Error tracking download:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // Get resource analytics (admin only)
  app.get("/make-server-04919ac5/resources/analytics/downloads", requireAuth, async (c: any) => {
    try {
      const allDownloads = await kv.getByPrefix("download:");
      
      const byResource: any = {};
      const byEmail: any = {};
      
      allDownloads.forEach((download: any) => {
        if (!byResource[download.resourceId]) {
          byResource[download.resourceId] = {
            resourceId: download.resourceId,
            resourceTitle: download.resourceTitle,
            count: 0,
            emails: []
          };
        }
        byResource[download.resourceId].count++;
        byResource[download.resourceId].emails.push(download.email);
        
        if (!byEmail[download.email]) {
          byEmail[download.email] = {
            email: download.email,
            name: download.name,
            downloads: []
          };
        }
        byEmail[download.email].downloads.push({
          resourceTitle: download.resourceTitle,
          timestamp: download.timestamp
        });
      });
      
      return c.json({ 
        success: true, 
        analytics: {
          total: allDownloads.length,
          byResource: Object.values(byResource),
          byEmail: Object.values(byEmail),
          recentDownloads: allDownloads
            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 50)
        }
      });
    } catch (error: any) {
      console.error("Error fetching resource analytics:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // Upload file endpoint (admin only) - handles complete file upload server-side
  app.post("/make-server-04919ac5/resources/upload", requireAuth, async (c: any) => {
    try {
      // Parse multipart form data
      const formData = await c.req.formData();
      const file = formData.get('file');
      
      if (!file || !(file instanceof File)) {
        return c.json({ success: false, error: "No file provided" }, 400);
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'text/html'];
      if (!allowedTypes.includes(file.type)) {
        return c.json({ 
          success: false, 
          error: "Only PDF and HTML files are allowed" 
        }, 400);
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return c.json({ 
          success: false, 
          error: "File size must not exceed 10MB" 
        }, 400);
      }

      const bucketName = "make-04919ac5-resources";
      
      // Ensure bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some((bucket: any) => bucket.name === bucketName);
      
      if (!bucketExists) {
        await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800,
          allowedMimeTypes: ['application/pdf', 'text/html']
        });
        console.log(`✅ Created storage bucket: ${bucketName}`);
      }

      // Generate unique file path
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${timestamp}-${sanitizedFileName}`;

      // Convert File to ArrayBuffer for upload
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Upload file using service role (bypasses RLS)
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, uint8Array, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        console.error("Storage upload error:", error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      console.log(`✅ File uploaded successfully: ${file.name} -> ${publicUrl}`);

      return c.json({ 
        success: true,
        fileUrl: publicUrl,
        fileName: file.name,
        filePath: filePath
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      return c.json({ 
        success: false, 
        error: error.message || "Upload failed" 
      }, 500);
    }
  });
}
