// useFileStore.js
import { create } from "zustand";
import supabase from "@/utils/Supabase-client.js";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Link, Star } from "lucide-react";

const DEFAULT_IMAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_DEFAULT_COVER;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;
const moyasar_key = process.env.NEXT_PUBLIC_MOYASAR_SECRET_KEY;
const BUCKET_NAME = "notes";
const domain = "https://aplusplatformsa.com";

export const useFileStore = create((set, get) => ({
  loading: false,
  error: null,
  files: [],
  note: null,
  notes: [],
  growthRate: 0,
  totalNotes: 0,
  downloadLoading: false,
  users: [],
  getTotalNotes: async () => {
    try {
      set({ loading: true });
      const { count, error } = await supabase
        .from("files")
        .select("*", { count: "exact", head: true });

      if (error) throw error;

      set({ loading: false, totalNotes: count || 0 });
      return count || 0;
    } catch (error) {
      return get().handleError(error, "فشل في جلب عدد المستخدمين");
    }
  },
  createNote: async (formData) => {
    const title = formData.get("title");
    const description = formData.get("description");
    const price = Number(formData.get("price"));
    const university = formData.get("university");
    const college = formData.get("college");
    const subject = formData.get("subject");
    const pagesNumber = Number(formData.get("pagesNumber"));
    const year = Number(formData.get("year"));
    const contactMethod = formData.get("contactMethod");
    const file = formData.get("file");
    const imageFile = formData.get("imageFile");

    try {
      set({ loading: true, error: null });

      // Fetch the authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("المستخدم غير مسجل الدخول");
      }

      if (!file) {
        throw new Error("يجب اختيار ملف PDF");
      }

      // Upload PDF file using Axios
      const pdfExtension = file.name.split(".").pop();
      const pdfFilename = `pdfs/${user.id}_${Date.now()}.${pdfExtension}`;

      const pdfResponse = await axios.post(
        `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${pdfFilename}`,
        file,
        {
          headers: {
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "x-upsert": "true",
            "Content-Type": file.type,
          },
        }
      );

      if (pdfResponse.status !== 200) {
        throw new Error("فشل في رفع ملف PDF");
      }

      const pdfUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${pdfFilename}`;

      // Upload image file if provided
      let imageUrl = DEFAULT_IMAGE_URL;
      if (imageFile) {
        const imgExtension = imageFile.name.split(".").pop();
        const imgFilename = `images/${user.id}_${Date.now()}.${imgExtension}`;

        const imgResponse = await axios.post(
          `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${imgFilename}`,
          imageFile,
          {
            headers: {
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "x-upsert": "true",
              "Content-Type": imageFile.type,
            },
          }
        );

        if (imgResponse.status !== 200) {
          throw new Error("فشل في رفع الصورة");
        }

        imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${imgFilename}`;
      }

      // Insert note data into Supabase table
      const { data: files, error: insertError } = await supabase
        .from("files")
        .insert([
          {
            title,
            description,
            price: Number(price) || 0,
            file_url: pdfUrl,
            cover_url: imageUrl,
            owner_id: user.id,
            university,
            college,
            subject,
            pages_number: pagesNumber || 0,
            year: year || new Date().getFullYear(),
            contact_method: contactMethod,
            created_at: new Date().toISOString(),
            downloads: 0,
            file_path: pdfFilename,
          },
        ])
        .select();

      if (insertError) {
        throw new Error("فشل حفظ بيانات الملف: " + insertError.message);
      }

      // Update notes count
      await get().getNotesCount();

      // Insert notification
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "تم إنشاء ملخص جديد",
        type: "note",
      });

      toast({
        title: "تم إنشاء الملخص بنجاح",
        variant: "success",
      });

      set({ loading: false, error: null });
      return files[0];
    } catch (err) {
      console.error("Error in createNote:", err);
      toast({
        title: "حدث خطأ",
        description: err.message || "حدث خطأ غير متوقع أثناء إنشاء الملخص",
        variant: "destructive",
      });
      set({ loading: false, error: err.message });
      return null;
    }
  },

  getAllNotes: async (page = 1, itemsPerPage = 10) => {
    try {
      set({ loading: true, error: null });

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const {
        data: files,
        count,
        error,
      } = await supabase
        .from("files")
        .select("*", { count: "exact" })
        .eq("isPublish", true)
        .order("created_at", { ascending: false })
        .range(from, to);
      if (error) {
        throw new Error("فشل في جلب الملفات");
      }
      set({
        loading: false,
        error: null,
        files: files || [],
      });
      console.log(files);
      return {
        data: files,
        totalItems: count,
        totalPages: Math.ceil(count / itemsPerPage),
        currentPage: page,
      };
    } catch (err) {
      console.error(err);
      set({ loading: false, error: err.message });
      return null;
    }
  },

  searchNotes: async (query, filters = {}, page = 1, itemsPerPage = 10) => {
    try {
      set({ loading: true, error: null });

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let supabaseQuery = supabase
        .from("files")
        .select("*", { count: "exact" })
        .eq("isPublish", true)
        .range(from, to);

      if (query) {
        supabaseQuery = supabaseQuery.or(
          `title.ilike.%${query}%,description.ilike.%${query}%,subject.ilike.%${query}%`
        );
      }

      if (filters.university) {
        supabaseQuery = supabaseQuery.eq("university", filters.university);
      }

      if (filters.college) {
        supabaseQuery = supabaseQuery.eq("college", filters.college);
      }

      if (filters.year) {
        supabaseQuery = supabaseQuery.eq("year", filters.year);
      }

      // الترتيب حسب sortBy
      switch (filters.sortBy) {
        case "downloads_desc":
          supabaseQuery = supabaseQuery.order("downloads", {
            ascending: false,
          });
          break;
        case "price_asc":
          supabaseQuery = supabaseQuery.order("price", { ascending: true });
          break;
        case "price_desc":
          supabaseQuery = supabaseQuery.order("price", { ascending: false });
          break;
        case "date_desc":
        default:
          supabaseQuery = supabaseQuery.order("created_at", {
            ascending: false,
          });
          break;
      }

      const { data: files, count, error } = await supabaseQuery;

      if (error) throw error;

      set({
        loading: false,
        files: files || [],
        error: null,
        totalNotes: count || 0,
      });

      return {
        data: files,
        totalItems: count,
        totalPages: Math.ceil(count / itemsPerPage),
        currentPage: page,
      };
    } catch (err) {
      console.error(err);
      toast({
        title: "فشل في البحث",
        description: err.message || "حدث خطأ أثناء البحث",
        variant: "destructive",
      });
      set({ loading: false, error: err.message });
      return null;
    }
  },

  getSingleNote: async ({ id }) => {
    try {
      set({ loading: true, error: null });

      if (!id) {
        throw new Error("معرف الملخص غير صالح");
      }

      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error("فشل تحميل بيانات الملخص من الخادم");
      }

      if (!data) {
        throw new Error("لم يتم العثور على الملخص المطلوب");
      }

      set({ note: data, loading: false, error: null });
      return data;
    } catch (error) {
      console.error("Error in getSingleNote:", error);
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  getSellerNotes: async ({ sellerId }) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("owner_id", sellerId);
      if (error) throw error;
      set({ loading: false, files: data || [] });
      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      return [];
    }
  },

  deleteNote: async ({ id }) => {
    try {
      set({ loading: true, error: null });

      const { data: note, error: fetchError } = await supabase
        .from("files")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      if (note.file_path) {
        await supabase.storage.from(BUCKET_NAME).remove([note.file_path]);
      }

      if (note.cover_url && !note.cover_url.includes(DEFAULT_IMAGE_URL)) {
        const coverPath = note.cover_url.split(`${BUCKET_NAME}/`)[1];
        await supabase.storage.from(BUCKET_NAME).remove([coverPath]);
      }

      const { error } = await supabase.from("files").delete().eq("id", id);
      if (error) throw error;

      await get().getNotesCount();

      await supabase.from("notifications").insert({
        user_id: note.owner_id,
        title: "تم حذف ملخص",
        body: `تم حذف ملخصك بعنوان "${note.title}"`,
        type: "note",
      });

      toast({
        title: "تم حذف الملخص بنجاح",
        variant: "success",
      });

      set({ loading: false });
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      set({ loading: false, error: error.message });
      return false;
    }
  },

  downloadNote: async ({ filePath }) => {
    try {
      set({ downloadLoading: true, error: null });
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filePath.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      await supabase.rpc("increment_download", { file_id: filePath });

      set({ downloadLoading: false });
    } catch (error) {
      console.error("Download error:", error);
      set({ downloadLoading: false, error: error.message });
      throw error;
    }
  },

  purchaseNote: async ({
    noteId,
    userId,
    invoice_id,
    status,
    message,
    buyerId,
  }) => {
    set({ loading: true, error: null });

    try {
      const { data: currentFile, error: fetchError } = await supabase
        .from("files")
        .select("*")
        .eq("id", noteId)
        .single();

      if (fetchError)
        throw new Error("Failed to fetch note: " + fetchError.message);
      if (!currentFile) throw new Error("Note not found");

      const currentPurchasers = currentFile.purchased_by || [];
      if (currentPurchasers.includes(userId)) {
        throw new Error("لقد قمت بشراء هذا الملخص مسبقاً");
      }

      const platformFeeRate = 0.15;
      const editionTax = 2;
      const platformFee = currentFile.price * platformFeeRate;
      const ownerEarnings = currentFile.price - platformFee - editionTax;

      const { data: transactionResult, error: transactionError } =
        await supabase.rpc("handle_note_purchase", {
          note_id: noteId,
          buyer_id: userId,
          owner_id: currentFile.owner_id,
          note_price: currentFile.price - editionTax,
          platform_fee_rate: platformFeeRate,
        });

      const { data: salesData, error: salesError } = await supabase
        .from("sales")
        .insert([
          {
            user_id: userId,
            note_id: noteId,
            amount: currentFile.price,
            platform_fee: platformFee,
            payment_method: "bank",
            note_title: currentFile.title,
            invoice_id: invoice_id,
            status: status,
            message: message,
            buyerId: buyerId,
          },
        ]);

      if (salesError)
        throw new Error("Failed to record sale: " + salesError.message);

      await supabase.from("notifications").insert([
        {
          user_id: userId,
          title: "تم شراء الملخص  بنجاح",
          body: `تم شراء الملخص  بنجاح"${
            currentFile.title
          }" بنجاح , رقم الطلب: ${invoice_id}, ${"💸"}, ${(
            <a href={`notes/${noteId}`}>عرض الملخص</a>
          )} `,
          type: "purchase",
        },
        {
          user_id: currentFile.owner_id,
          title: "تم بيع ملخص",
          body: `تم بيع ملخصك "${
            currentFile.title
          }" وتم إضافة ${ownerEarnings.toFixed(2)} إلى رصيدك`,
          type: "sale",
        },
      ]);

      set({ loading: false });
      return {
        success: true,
        data: {
          ...salesData,
          platformFee,
          ownerEarnings,
        },
      };
    } catch (error) {
      console.error("Purchase failed:", error.message);
      set({
        loading: false,
        error: error.message || "حدث خطأ غير متوقع",
      });
      return { success: false, error: error.message };
    }
  },
  addReviewToNote: async ({ noteId, reviewData }) => {
    try {
      set({ loading: true, error: null });

      const { data: currentFile, error: fetchError } = await supabase
        .from("files")
        .select("reviews")
        .eq("id", noteId)
        .single();

      if (fetchError) throw fetchError;

      const currentReviews = currentFile.reviews || [];
      const existingReviewIndex = currentReviews.findIndex(
        (review) => review.userId === reviewData.userId
      );

      if (existingReviewIndex !== -1) {
        currentReviews[existingReviewIndex] = reviewData;
      } else {
        currentReviews.push(reviewData);
      }

      const { error } = await supabase
        .from("files")
        .update({ reviews: currentReviews })
        .eq("id", noteId);

      if (error) throw error;

      await supabase.from("notifications").insert({
        user_id: reviewData.userId,
        title: "شكرًا لتقييمك! تم تسجيل تقييمك لهذا الملخص.",
        body: `شكرًا لتقييمك! تم تسجيل تقييمك لهذا الملخص. ${(<Star />)} ${(
          <Link href=""> تفاصيل التقييم </Link>
        )}`,
        type: "review",
      });

      set({ loading: false });
      return { success: true };
    } catch (error) {
      console.error("Error adding review:", error);
      set({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  getPurchasedNotes: async ({ userId }) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .contains("purchased_by", [userId]);

      if (error) throw error;

      const { data: salesData, error: salesError } = await supabase
        .from("sales")
        .select("*")
        .eq("user_id", userId);

      if (salesError) throw salesError;

      const dataWithSales = data.map((note) => {
        const salesForNote = salesData.filter(
          (sale) => sale.note_id === note.id
        );
        return { ...note, saleId: salesForNote[0]?.id };
      });
      set({ loading: false, files: dataWithSales });
      return dataWithSales;
    } catch (error) {
      console.error("Error fetching purchased notes:", error);
      set({ loading: false, error: error.message });
      return [];
    }
  },

  hasUserReviewed: async ({ noteId, userId }) => {
    try {
      const { data, error } = await supabase
        .from("files")
        .select("reviews")
        .eq("id", noteId)
        .single();

      if (error) throw error;

      return data.reviews?.some((review) => review.userId === userId) || false;
    } catch (error) {
      console.error("Error checking review:", error);
      return false;
    }
  },
  getAllReviews: async ({ noteId, sortOption = "latest" }) => {
    try {
      const { data, error } = await supabase
        .from("files")
        .select("reviews")
        .eq("id", noteId)
        .single();

      if (error) throw error;

      const reviews = data?.reviews || [];
      return reviews;
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  getPaginatedNotes: async (page = 1, itemsPerPage = 10, filters = {}) => {
    try {
      set({ loading: true, error: null });

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from("files")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`
        );
      }

      if (filters.university) {
        query = query.eq("university", filters.university);
      }
      if (filters.college) {
        query = query.eq("college", filters.college);
      }
      if (filters.year) {
        query = query.eq("year", filters.year);
      }
      if (filters.subject) {
        query = query.ilike("subject", `%${filters.subject}%`);
      }

      if (filters.price) {
        query = query.ilike("price", `%${filters.price}%`);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      set({
        loading: false,
        notes: data || [],
        totalNotes: count || 0,
      });

      return {
        data,
        totalItems: count,
        totalPages: Math.ceil(count / itemsPerPage),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error fetching notes:", error);
      set({ loading: false, error: error.message });
      return null;
    }
  },

  getFilesMonthlyGrowth: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.rpc("get_files_monthly_growth");

      if (error) throw error;

      set({ growthRate: data?.growth_rate || 0, loading: false });
      return data;
    } catch (error) {
      console.error("Error fetching files growth:", error);
      set({ loading: false, error: error.message });
      return {
        current_count: 0,
        previous_count: 0,
        growth_rate: 0,
      };
    }
  },

  createPaymentLink: async ({ noteId, userId, amount }) => {
    try {
      const response = await axios.post(
        "https://api.moyasar.com/v1/invoices",
        {
          amount: Math.round(parseFloat(amount) * 100),
          currency: "SAR",
          description: `شراء ملخص رقم ${noteId}`,
          callback_url: `${domain}/api/payment/callback`,
          success_url: `${domain}/payment-success?noteId=${noteId}&userId=${userId}`,
          back_url: `${domain}/checkout?noteId=${noteId}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`${moyasar_key}`),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Moyasar error:", error.response?.data || error.message);
      throw error;
    }
  },

  getCollegesByUniversity: async (university) => {
    try {
      const { data, error } = await supabase
        .from("files")
        .select("college")
        .eq("university", university)
        .neq("college", null);

      if (error) throw error;

      return [...new Set(data.map((item) => item.college))];
    } catch (error) {
      console.error("Error fetching colleges:", error);
      return [];
    }
  },

  getUniversities: async () => {
    try {
      const { data, error } = await supabase
        .from("files")
        .select("university")
        .neq("university", null);

      if (error) throw error;

      return [...new Set(data.map((item) => item.university))];
    } catch (error) {
      console.error("Error fetching universities:", error);
      return [];
    }
  },
  updateNote: async (noteId, formData) => {
    try {
      set({ loading: true, error: null });

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("المستخدم غير مسجل الدخول");
      }

      // Extract values from FormData
      const title = formData.get("title");
      const description = formData.get("description");
      const price = Number(formData.get("price"));
      const university = formData.get("university");
      const college = formData.get("college");
      const subject = formData.get("subject");
      const pagesNumber = Number(formData.get("pagesNumber"));
      const year = Number(formData.get("year"));
      const contactMethod = formData.get("contactMethod");
      const file = formData.get("file");
      const imageFile = formData.get("imageFile");
      const removeFile = formData.get("removeFile") === "true";
      const removePreviewImage = formData.get("removePreviewImage") === "true";

      // Fetch existing note to verify ownership and get current file paths
      const { data: existingNote, error: fetchError } = await supabase
        .from("files")
        .select("owner_id, file_path, file_url, cover_url")
        .eq("id", noteId)
        .single();

      if (fetchError || !existingNote) {
        throw new Error(
          "الملخص غير موجود أو حدث خطأ في الجلب: " +
            (fetchError?.message || "خطأ غير معروف")
        );
      }

      if (existingNote.owner_id !== user.id) {
        throw new Error("غير مصرح لك بتعديل هذا الملخص");
      }

      // Initialize update data
      const updateData = {
        title,
        description,
        price,
        university,
        college,
        subject,
        pages_number: pagesNumber,
        year,
        contact_method: contactMethod,
      };

      // Handle PDF file update
      let pdfFilename = existingNote.file_path;
      let fileUrl = existingNote.file_url;
      if (file && file.size > 0) {
        const pdfExtension = file.name.split(".").pop()?.toLowerCase();
        pdfFilename = `pdfs/${user.id}_${Date.now()}.${pdfExtension}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(pdfFilename, file);

        if (uploadError) {
          throw new Error("فشل في رفع ملف PDF: " + uploadError.message);
        }

        const { data: pdfUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(pdfFilename);
        fileUrl = pdfUrlData.publicUrl;
        updateData.file_url = fileUrl;
        updateData.file_path = pdfFilename;
      } else if (removeFile) {
        throw new Error("يجب رفع ملف PDF جديد عند اختيار حذف الملف الحالي");
      }

      // Handle image file update
      let imageUrl = existingNote.cover_url;
      if (imageFile && imageFile.size > 0) {
        const imgFilename = `images/${user.id}_${Date.now()}.${imageFile.name
          .split(".")
          .pop()
          ?.toLowerCase()}`;
        const { error: imageUploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(imgFilename, imageFile);

        if (imageUploadError) {
          // Clean up new PDF if uploaded
          if (file && file.size > 0) {
            await supabase.storage.from(BUCKET_NAME).remove([pdfFilename]);
          }
          throw new Error("فشل في رفع الصورة: " + imageUploadError.message);
        }

        const { data: imageUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(imgFilename);
        imageUrl = imageUrlData.publicUrl;
        updateData.cover_url = imageUrl;
      } else if (removePreviewImage) {
        updateData.cover_url = DEFAULT_IMAGE_URL;
      }

      // Update note in database
      const { data: updatedNote, error: updateError } = await supabase
        .from("files")
        .update(updateData)
        .eq("id", noteId)
        .select()
        .single();

      if (updateError) {
        // Clean up uploaded files if update fails
        if (file && file.size > 0) {
          await supabase.storage.from(BUCKET_NAME).remove([pdfFilename]);
        }
        if (imageFile && imageFile.size > 0) {
          await supabase.storage
            .from(BUCKET_NAME)
            .remove([
              `images/${user.id}_${Date.now()}.${imageFile.name
                .split(".")
                .pop()}`,
            ]);
        }
        throw new Error("فشل في تحديث بيانات الملخص: " + updateError.message);
      }

      // Clean up old files if new ones were uploaded
      if (file && file.size > 0 && existingNote.file_path) {
        await supabase.storage
          .from(BUCKET_NAME)
          .remove([existingNote.file_path]);
      }
      if (
        imageFile &&
        imageFile.size > 0 &&
        existingNote.cover_url &&
        existingNote.cover_url !== DEFAULT_IMAGE_URL
      ) {
        const oldImagePath = existingNote.cover_url.split("/").pop();
        await supabase.storage
          .from(BUCKET_NAME)
          .remove([`images/${oldImagePath}`]);
      }

      // Insert notification
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          title: "تم تحديث الملخص",
          body: `تم تحديث الملخص بعنوان "${title}" بنجاح`,
          type: "note",
        });

      if (notificationError) {
        console.warn(
          "Failed to insert notification:",
          notificationError.message
        );
      }

      toast({
        title: "تم تحديث الملخص بنجاح",
        description: "تم تحديث بيانات الملخص بنجاح.",
        variant: "success",
      });

      set({ loading: false, error: null });
      return updatedNote;
    } catch (err) {
      console.error("Error in updateNote:", err);
      toast({
        title: "حدث خطأ",
        description: err.message || "حدث خطأ غير متوقع أثناء تحديث الملخص",
        variant: "destructive",
      });
      set({ loading: false, error: err.message });
      return null;
    }
  },
  makeUnPublished: async ({ noteId }) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from("files")
        .update({ isPublish: false })
        .eq("id", noteId);
      if (error) {
        throw error;
      }
      set({ loading: false, error: null });
      return true;
    } catch (error) {
      console.error("Error in makeUnPuplished:", error);
      toast({
        title: "حدث خطأ",
        description: error.message || "حدث خطأ غير متوقع أثناء إلغاء النشر",
        variant: "destructive",
      });
      set({ loading: false, error: error.message });
      await getAllNotes();
      return false;
    }
  },
  makePublished: async ({ noteId }) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from("files")
        .update({ isPublish: true })
        .eq("id", noteId);
      if (error) {
        throw error;
      }
      set({ loading: false, error: null });
      return true;
    } catch (error) {
      console.error("Error in makePublished:", error);
      toast({
        title: "حدث خطأ",
        description: error.message || "حدث خطأ غير متوقع أثناء النشر",
        variant: "destructive",
      });
      set({ loading: false, error: error.message });
      await getAllNotes();
      return false;
    }
  },
  searchUsers: async (searchQuery) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .ilike("full_name", `%${searchQuery}%`)
        .order("created_at", { ascending: false });
      if (error) {
        throw error;
      }
      set({ loading: false, error: null, users: data || [] });
      console.log("data", data);
      return data;
    } catch (error) {
      console.error("Error in searchUsers:", error);
      set({ loading: false, error: error.message });
      return null;
    }
  },
  clearError: () => set({ error: null }),
}));
