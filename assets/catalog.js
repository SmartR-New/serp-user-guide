(function () {
  var MODULES = [
    {
      id: "module-general",
      label: "Chung",
      items: [
        {
          href: "erp-clear-browser-cache/index.html",
          label: "Làm mới trang ERP (tắt cache DevTools)",
        },
      ],
    },
    {
      id: "module-hr",
      label: "HR",
      groups: [
        {
          label: "Đề nghị thanh toán",
          items: [
            { href: "expense-claim/index.html", label: "Tổng quan (end-to-end)" },
            { href: "expense-claim-employee/index.html", label: "Nhân viên" },
            { href: "expense-claim-approver/index.html", label: "Người duyệt" },
            { href: "expense-claim-auditor/index.html", label: "Kiểm Toán" },
            { href: "expense-claim-controller/index.html", label: "Kiểm Soát Trưởng" },
            { href: "expense-claim-advance-payment/index.html", label: "Chi đề nghị tạm ứng" },
            { href: "expense-claim-payment/index.html", label: "Chi sau khi duyệt" },
          ],
        },
      ],
    },
    {
      id: "module-crm",
      label: "CRM",
      items: [
        { href: "my-sales-dashboard/index.html", label: "My Sales Dashboard" },
        { href: "management-dashboard/index.html", label: "Management Dashboard" },
      ],
    },
    {
      id: "module-service",
      label: "Service",
      groups: [
        {
          label: "Quy trình Ticket → Job → Time",
          items: [
            { href: "service/overview/index.html", label: "Tổng quan" },
            { href: "service/roles/index.html", label: "Vai trò & phân quyền" },
            { href: "service/ticket/index.html", label: "Ticket" },
            {
              href: "ticket-generate-schedule/index.html",
              label: "Generate Schedule (Ticket PM)",
            },
            { href: "service/service-job/index.html", label: "Service Job" },
            {
              href: "service-job-cm-bootstrap/index.html",
              label: "Service Job CM — tạo Ticket khi Save",
            },
            { href: "service/service-time/index.html", label: "Service Time" },
          ],
        },
        {
          label: "Workspace & dashboard",
          items: [
            { href: "support/index.html", label: "Service workspace & Support Dashboard" },
          ],
        },
        {
          label: "Báo cáo",
          items: [
            { href: "service-job-report/index.html", label: "Service Job Report" },
            { href: "service-time-report/index.html", label: "Service Time Report" },
          ],
        },
        {
          label: "Đọc liền một trang",
          items: [
            {
              href: "support-ticket-workflow/index.html",
              label: "Ticket → Job → Time (đầy đủ)",
            },
          ],
        },
      ],
    },
  ];

  var script = document.currentScript;

  function detectBaseFromScript() {
    if (!script) return "";
    var attr = script.getAttribute("data-base");
    if (attr !== null && attr !== undefined) return attr;
    var src = script.getAttribute("src") || "";
    if (!src || /^https?:/i.test(src)) {
      var pathSrc = script.src || "";
      var idx = pathSrc.indexOf("/assets/catalog.js");
      if (idx < 0) return "";
      var guideRoot = pathSrc.slice(0, idx);
      var page = window.location.href.split("#")[0].split("?")[0];
      if (page.indexOf(guideRoot) !== 0) return "";
      var rest = page.slice(guideRoot.length + 1);
      var parts = rest.split("/");
      parts.pop();
      return parts.length ? "../".repeat(parts.length) : "";
    }
    return src.replace(/assets\/catalog\.js(\?.*)?$/i, "");
  }

  var base = detectBaseFromScript();

  function resolveHref(href) {
    if (!href) return href;
    if (/^https?:\/\//i.test(href) || href.startsWith("/")) return href;
    if (!base) return href;
    return base + href.replace(/^\.\//, "");
  }

  function resolveIndexHref() {
    return base ? base + "index.html" : "index.html";
  }

  function ensureStylesheet() {
    if (document.querySelector("link[data-guide-catalog]")) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = resolveHref("assets/catalog.css");
    link.setAttribute("data-guide-catalog", "");
    document.head.appendChild(link);
  }

  function ensureLayout() {
    var existing = document.getElementById("guide-sidebar");
    if (existing) return existing;

    document.body.classList.add("guide-catalog");
    var layout = document.createElement("div");
    layout.className = "guide-layout";

    var aside = document.createElement("aside");
    aside.id = "guide-sidebar";
    aside.className = "guide-sidebar";
    aside.setAttribute("aria-label", "Mục lục hướng dẫn theo module");

    var main = document.createElement("main");
    main.className = "guide-main guide-main--doc";

    var toMove = [];
    for (var i = 0; i < document.body.childNodes.length; i++) {
      var node = document.body.childNodes[i];
      if (node === script) continue;
      if (node.nodeType === 1 && node.tagName === "SCRIPT") continue;
      toMove.push(node);
    }
    toMove.forEach(function (node) {
      main.appendChild(node);
    });

    layout.appendChild(aside);
    layout.appendChild(main);
    document.body.insertBefore(layout, script);

    return aside;
  }

  function chevronSvg() {
    return (
      '<svg class="guide-module__chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
      '<path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
    );
  }

  function isCurrentPage(href) {
    try {
      var path = window.location.pathname.replace(/\\/g, "/").toLowerCase();
      var norm = href.replace(/^\.\//, "").toLowerCase();
      if (path.endsWith("/" + norm) || path.endsWith(norm)) {
        return true;
      }
      if (
        norm === "expense-claim/index.html" &&
        /\/expense-claim(-|\/)/.test(path)
      ) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function renderSidebar(container) {
    var brand = document.createElement("a");
    brand.className = "guide-sidebar__brand";
    brand.href = resolveIndexHref();
    brand.innerHTML =
      '<span class="guide-sidebar__brand-title">iMED ERP</span>' +
      '<span class="guide-sidebar__brand-sub">Tài liệu hướng dẫn</span>';
    container.appendChild(brand);

    var nav = document.createElement("div");
    nav.className = "guide-sidebar__nav";
    nav.setAttribute("role", "navigation");

    MODULES.forEach(function (mod) {
      var wrap = document.createElement("div");
      wrap.className = "guide-module";
      wrap.dataset.moduleId = mod.id;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "guide-module__toggle";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "panel-" + mod.id);
      btn.id = "toggle-" + mod.id;
      btn.innerHTML = chevronSvg() + "<span>" + mod.label + "</span>";
      btn.addEventListener("click", function () {
        var open = wrap.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        var target = document.getElementById(mod.id);
        if (open && target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          if (history.replaceState) {
            history.replaceState(null, "", "#" + mod.id);
          } else {
            location.hash = mod.id;
          }
        }
      });
      wrap.appendChild(btn);

      var panel = document.createElement("div");
      panel.className = "guide-module__panel";
      panel.id = "panel-" + mod.id;
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", "toggle-" + mod.id);

      function addItem(item) {
        var a = document.createElement("a");
        a.className = "guide-module__link";
        a.href = resolveHref(item.href);
        a.textContent = item.label;
        if (item.href && isCurrentPage(item.href)) {
          a.classList.add("is-active");
        }
        panel.appendChild(a);
      }

      if (mod.groups) {
        mod.groups.forEach(function (group) {
          if (group.label) {
            var gl = document.createElement("div");
            gl.className = "guide-module__group-label";
            gl.textContent = group.label;
            panel.appendChild(gl);
          }
          (group.items || []).forEach(addItem);
        });
      } else {
        (mod.items || []).forEach(addItem);
      }

      wrap.appendChild(panel);
      nav.appendChild(wrap);
    });

    container.appendChild(nav);
  }

  function openActiveModule() {
    var active = document.querySelector(".guide-module__link.is-active");
    if (!active) return;
    var wrap = active.closest(".guide-module");
    if (!wrap) return;
    wrap.classList.add("is-open");
    var btn = wrap.querySelector(".guide-module__toggle");
    if (btn) btn.setAttribute("aria-expanded", "true");
  }

  function openFromHash() {
    var id = (location.hash || "").replace(/^#/, "");
    if (!id) return;
    var wrap = document.querySelector('.guide-module[data-module-id="' + id + '"]');
    if (!wrap) return;
    wrap.classList.add("is-open");
    var btn = wrap.querySelector(".guide-module__toggle");
    if (btn) btn.setAttribute("aria-expanded", "true");
    var target = document.getElementById(id);
    if (target) {
      requestAnimationFrame(function () {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function setupMobile(layout) {
    if (layout.querySelector(".guide-sidebar-backdrop")) return;

    var backdrop = document.createElement("div");
    backdrop.className = "guide-sidebar-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.addEventListener("click", function () {
      layout.classList.remove("sidebar-open");
    });
    layout.insertBefore(backdrop, layout.firstChild);

    if (document.querySelector(".guide-sidebar-toggle")) return;

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "guide-sidebar-toggle";
    toggle.textContent = "Mục lục";
    toggle.addEventListener("click", function () {
      layout.classList.toggle("sidebar-open");
    });
    document.body.appendChild(toggle);
  }

  document.body.classList.add("guide-catalog");

  ensureStylesheet();
  var sidebar = ensureLayout();
  if (!sidebar) sidebar = document.getElementById("guide-sidebar");
  if (!sidebar) return;

  if (!sidebar.dataset.rendered) {
    renderSidebar(sidebar);
    sidebar.dataset.rendered = "1";
  }

  var layout = sidebar.closest(".guide-layout");
  if (layout) setupMobile(layout);

  openActiveModule();
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
})();